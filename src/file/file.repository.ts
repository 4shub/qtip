import DB from '../util/mongodb';
import {FileData, FileMeta, FilePartial, PathType} from './file.types';

const file = DB.load().collection('file');

export const getPublicFilesByPath = (path: PathType): Promise<FilePartial[]> =>
    file.find({ path: { $all: path }, public: true }, { projection: { path: 1 } }).toArray();

export const getFileMetaByPath = (path: PathType): Promise<FileMeta[]> =>
    file.find({ path: { $all: path } }, { projection: { path: 1, public: 1, restrictions: 1 } }).toArray();

export const getFileByPath = (path: PathType): Promise<FileData> =>
    file.findOne({ path });

export const upsertFile = (data: FileData): Promise<void> =>
    file.insertOne(data);

export const updateFile = (path: PathType, data: Record<string, any>): Promise<void> =>
    file.updateOne({ path }, { $set: data } );


export const deleteFileByPath = (path: PathType): Promise<void> => file.deleteOne({ path });
