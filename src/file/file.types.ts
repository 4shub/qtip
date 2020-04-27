export type FileRestrictions = {
    ip?: string[],
}

export interface FileData {
    path: PathType;
    content: string;
    title: string;
    public: boolean,
    restrictions?: FileRestrictions;
}

export interface FilePartial {
    path: PathType;
}

export interface FileMeta {
    path: PathType;
    public: boolean,
    restrictions?: FileRestrictions;
}

export type PathType = string[];

export type PostFileBody = {
    content: string;
}

export type AddIpRestrictionBody = {
    ipList: string[];
}