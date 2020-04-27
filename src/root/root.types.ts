import { FileData, PathType } from '../file/file.types';

export interface FilePayload extends FileData {
    nav: FilePayloadNav[];
    children: ChildrenNavItem[];
    isDirectory?: boolean;
}

export interface FilePayloadNav {
    path: string;
    label: string;
}

export interface ChildrenNavItem {
    level: number;
    path: string;
}

export type GetFileMethod = 'ls';

export type ListFileResponse = string[];