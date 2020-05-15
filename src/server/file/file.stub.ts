import { FileData } from './file.types';

const contentStub = `
#Summary
This is an example content stub that is used for qtip. Use this to stub any tests or dev work you need for this application.

## SubHeading
### H3
#### H4

#Usage
meme
`;

export const fileStub: FileData = {
    title: 'Things I use',
    images: {},
    content: contentStub,
    path: ['test-data', 'open'],
    public: true,
};
