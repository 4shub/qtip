import { Request, Response } from 'express';
import { AddIpRestrictionBody, FileData, PostFileBody } from './file.types';
import {
    deleteFileByPath,
    getFileByPath,
    updateFile,
    upsertFile,
} from './file.repository';
import { getPathFromRequest } from '../root/root.helper';

export const postFile = async (req: Request, res: Response) => {
    try {
        const path = getPathFromRequest(req);

        const { content } = req.body as PostFileBody;

        if (!content) {
            res.status(400).send({ error: 'Content is empty' });
            return;
        }

        const existingFile = await getFileByPath(path);

        if (existingFile) {
            const title = content.split('\n', 1)[0].replace(/#/g, '');

            await updateFile(path, { title, content });
        } else {
            const title = content.split('\n', 1)[0].replace(/#/g, '');

            await upsertFile({ title, content, path, public: false });
        }

        res.sendStatus(200);
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
