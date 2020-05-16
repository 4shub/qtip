import fs from 'fs';
import path from 'path';

import Handlebars from 'handlebars';
import Showdown from 'showdown';
import { Request, Response } from 'express';
import { FilePayload, GetFileMethod } from './root.types';
import {
    sortChildrenAscending,
    getPathFromRequest,
    makeChildrenNav,
    makePath,
    validateFileVisibility,
} from './root.helper';
import {
    getFileByPath,
    getFileMetaByPath,
    getPublicFilesByPath,
} from '../file/file.repository';
import { FileData } from '../file/file.types';
import { authenticateUserPromise } from '../middleware';
import { QTIP_FILE_SYSTEM_NAME } from '../constants';
import { config } from '../config/config';
import markdown from "../../shared/markdown-interpreter";

const ROOT_HTML_FILE = path.join(__dirname, 'root.html');

const viewFile = async (req: Request, res: Response) => {
    const path = getPathFromRequest(req);

    const fileData = await getFileByPath(path);

    if (!fileData) {
        res.status(404).send({ error: 'File not found' });
        return;
    }

    res.send({ results: fileData.content });
};

const listFiles = async (req: Request, res: Response) => {
    const path = getPathFromRequest(req);

    const fileList = await getFileMetaByPath(path);

    const listFileResponse = fileList.map(
        ({ path, public: isPublic, restrictions }) => {
            let str = '';

            if (isPublic) {
                str = '[public] ';
            } else {
                str = '[private]';
            }

            str += ` /${path.join('/')}`;

            if (restrictions?.ip) {
                str += ` (restricted ip(s): ${restrictions.ip.join(',')})`;
            }

            return str;
        }
    );

    res.send({ results: listFileResponse });
};

const methodList: Record<string, (req: Request, res: Response) => void> = {
    ls: listFiles,
    cat: viewFile,
};

export const getAnyFile = async (req: Request, res: Response) => {
    try {
        const method = req.query.method as GetFileMethod;

        if (methodList[method]) {
            // all methods are restricted

            if (!(await authenticateUserPromise(req, res))) {
                // end program because the promise will take care of any auth thing
                return;
            }

            await methodList[method](req, res);
            return;
        }

        const path = getPathFromRequest(req);

        const [allRelatedFiles = [], actualFile] = await Promise.all([
            getPublicFilesByPath(path),
            getFileByPath(path).then(validateFileVisibility(req)),
        ]);

        // children of a path are values that are deeper than the path
        // given path: test/file
        // if a file returned is test/file/child, this would be a child of the other file
        const children = allRelatedFiles
            .filter(
                (file) =>
                    file.path[file.path.length - 1] !== path[path.length - 1]
            )
            .map(({ path }) => makeChildrenNav(path))
            .sort(sortChildrenAscending);

        if (!children.length && !actualFile) {
            // pass 404
            return res.sendStatus(404);
        }

        const file: FileData = actualFile as FileData;

        // todo: move this up
        const rootHTML = fs.readFileSync(ROOT_HTML_FILE, 'utf-8');
        const template = Handlebars.compile(rootHTML);

        const payload: FilePayload = {
            config,
            ...file,
            fileSystemName: QTIP_FILE_SYSTEM_NAME,
            isDirectory: !actualFile,
            content: file?.content && markdown.makeHtml(file.content),
            nav: makePath(path),
            children,
        };

        res.status(200).send(template(payload));
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
};
