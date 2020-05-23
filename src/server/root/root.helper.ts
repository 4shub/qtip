import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { ChildrenNavItem, FilePayloadNav } from './root.types';
import { FileData, PathType } from '../file/file.types';

export const makePath = (slug: string[]): FilePayloadNav[] =>
    slug.slice(1).map((label, index, arr) => {
        return {
            label,
            path: arr.slice(0, index + 1).join('/'),
        };
    });

export const makeChildrenNav = (path: PathType): ChildrenNavItem => ({
    path: path.join('/'),
    level: path.length - 1,
});

export const getUserIp = (req: Request): string =>
    req.header('x-forwarded-for') || req.connection.remoteAddress || '';

export const getPathFromRequest = ({ path }: Request): PathType =>
    path.split('/');

export const sortChildrenAscending = (
    { path: a }: ChildrenNavItem,
    { path: b }: ChildrenNavItem
): -1 | 1 | 0 => {
    if (a < b) {
        return -1;
    }
    if (b > a) {
        return 1;
    }

    return 0;
};

export const validateFileVisibility = (req: Request) => async (
    file: FileData
): Promise<FileData | void> => {
    if (!file) {
        return;
    }

    if (file.public) {
        return file;
    }

    if (file?.restrictions?.ip) {
        if (file.restrictions.ip.includes(getUserIp(req))) {
            return file;
        }
    }

    if (
        file?.restrictions?.accessCode &&
        typeof file.restrictions.accessCode === 'string' &&
        file.restrictions.accessCode === req.query.accessCode
    ) {
        return file;
    }

    return;
};
