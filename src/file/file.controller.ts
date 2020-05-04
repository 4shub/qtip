import { Request, Response } from 'express';
import {
    AddIpRestrictionBody,
    FileData,
    ImageData,
    ImageDetail,
    ImageMap,
    PostFileBody,
} from './file.types';
import {
    deleteFileByPath,
    getFileByPath,
    updateFile,
    upsertFile,
} from './file.repository';
import { getPathFromRequest } from '../root/root.helper';
import { createConvertImagePathToLocalFileName } from './file.helpers';
import { AWS_IMAGE_PATH } from '../constants';

type PrepareImagePayload = {
    imageDetails?: ImageDetail[];
    existingFile: FileData;
    content: string;
};

type PrepareImageResponse = {
    imagesToAskToUpload: string[];
    imagesToRetain: ImageData[];
    updatedContent: string;
};

const prepareImages = (
    req: Request,
    { imageDetails, existingFile, content }: PrepareImagePayload
): PrepareImageResponse => {
    const imagesToAskToUpload: string[] = [];
    const imagesToRetainMap: Record<string, ImageData> = {};
    let updatedContent = content;

    if (imageDetails && imageDetails.length) {
        const convertToLocalImagePath = createConvertImagePathToLocalFileName(req.path);

        if (imageDetails && imageDetails.length) {
            for (let image of imageDetails) {
                const localName = convertToLocalImagePath(image.originalPath);

                const localNameDB = localName.split('.')[0];
                const existingImage = existingFile && (existingFile?.images || {})[localNameDB];

                const isOutdatedImage =
                    existingImage &&
                    existingImage.updatedAt &&
                    existingImage.updatedAt < image.updatedAt;

                updatedContent = updatedContent.replace(
                    image.originalPath,
                    `${AWS_IMAGE_PATH}${localName}`
                );

                if (!existingFile || !existingImage || isOutdatedImage) {
                    imagesToAskToUpload.push(image.originalPath);
                } else {
                    imagesToRetainMap[localNameDB] = existingImage;
                }
            }
        }
    }

    const imagesToDelete: string[] = Object.values(existingFile?.images || [])
        .filter(({ localName }) => !imagesToRetainMap[localName.split('.')[0]])
        .map(({ localName }) => localName);

    return {
        imagesToAskToUpload,
        imagesToRetain: Object.values(imagesToRetainMap),
        updatedContent,
    };
};

export const uploadImage = async (req: Request, res: Response) => {
    console.log(req.file);
    const path = req.body.path.split('/');
    const localName = `/${(req.file as any).key}`;
    const imageDetail: ImageData = {
        originalName: req.file.originalname,
        localName: localName,
        updatedAt: new Date().valueOf(),
        source: (req.file as any).location
    }
    await updateFile(path, { [`images.${localName.split('.')[0]}`]: imageDetail  })
    res.sendStatus(200);
}

export const postFile = async (req: Request, res: Response, next: () => void) => {
    try {
        const path = getPathFromRequest(req);
        const { forcePublic } = req.query;
        const { content, imageDetails } = req.body as PostFileBody;

        if (!content) {
            res.status(400).send({ error: 'Content is empty' });
            return;
        }

        const promises = [];

        const existingFile = await getFileByPath(path);
        const title = content.split('\n', 1)[0].replace(/#/g, '');

        const {
            imagesToAskToUpload,
            imagesToRetain,
            updatedContent,
        } = prepareImages(req, { existingFile, imageDetails, content });

        if (existingFile) {
            const images = imagesToRetain.reduce((obj, image) => {
                obj[image.localName.split('.')[0]] = image;

                return obj;
            }, {} as ImageMap);

            promises.push(
                updateFile(path, { title, content: updatedContent, images })
            );
        } else {
            promises.push(
                upsertFile({
                    title,
                    content: updatedContent,
                    path,
                    public: forcePublic === 'true',
                    images: {},
                })
            );
        }

        res.status(200).send({ imagesToUpload: imagesToAskToUpload });
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
};

export const putFile = async (req: Request, res: Response) => {
    try {
        const path = getPathFromRequest(req);
        const method = req.query.method as string;

        const existingFile = await getFileByPath(path);
        if (!existingFile) {
            res.status(404).send({ error: 'This file does not exist' });
            return;
        }

        const appMap: Record<string, (req: Request, res: Response) => void> = {
            'make-public': makeFilePublic,
            'restrict-ip': addIpRestriction(existingFile),
        };

        if (appMap[method]) {
            await appMap[method](req, res);
            return;
        }

        res.status(400).send({ error: 'No method specified' });
    } catch (e) {
        res.sendStatus(500);
    }
};

export const makeFilePublic = async (req: Request, res: Response) => {
    const path = getPathFromRequest(req);

    await updateFile(path, { public: true, restrictions: null });

    res.sendStatus(200);
};

export const addIpRestriction = (existingFile: FileData) => async (
    req: Request,
    res: Response
) => {
    const { ipList } = req.body as AddIpRestrictionBody;

    if (existingFile.public) {
        res.status(400).send('Cannot add restriction to a public file!');
        return;
    }

    if (!ipList || !Array.isArray(ipList)) {
        res.status(400).send('Missing ip list');
        return;
    }

    const path = getPathFromRequest(req);

    await updateFile(path, { ['restrictions.ip']: ipList });

    res.sendStatus(200);
};

export const deleteFile = async (req: Request, res: Response) => {
    try {
        const path = getPathFromRequest(req);

        await deleteFileByPath(path);

        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
};
