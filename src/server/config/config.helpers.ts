import fs from 'fs';
import path from 'path';

export const getConfigFile = (fileName: string): string =>
    fs.readFileSync(path.join(__dirname, '../../', fileName), 'utf8');
