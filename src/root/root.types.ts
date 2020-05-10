import { FileData, PathType } from '../file/file.types';
import { SiteConfig } from '../config/config.types';

export interface FilePayload extends FileData {
    config: SiteConfig;
    nav: FilePayloadNav[];
    fileSystemName: string;
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
