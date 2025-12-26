export type FileRestrictions = {
    ip?: string[],
    accessCode: string;
}

type ImageLocalName = string;

export type ImageData = {
    source: string;
    localName: string;
    originalName: string;
    updatedAt: number;
}

export type ImageMap = Record<ImageLocalName, ImageData>;

export interface FileData {
    path: PathType;
    content: string;
    title: string;
    public: boolean,
    restrictions?: FileRestrictions;
    images: ImageMap;
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

export type ImageDetail = {
    originalPath: string;
    updatedAt: number;
}

export type PostFileBody = {
    content: string;

    imageDetails?: ImageDetail[];
}

export type AddIpRestrictionBody = {
    ipList: string[];
}

export type AddAccessCodeRestrictionBody = {
    code: string;
}