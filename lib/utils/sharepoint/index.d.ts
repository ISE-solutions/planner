import { SPRest } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/files';
import '@pnp/sp/folders';
declare const createFolder: (sp: SPRest, name: string, titleRootFolder: string) => Promise<void>;
declare const uploadFiles: (sp: SPRest, folderName: string, files: any[]) => Promise<void>;
declare const deleteFiles: (sp: SPRest, files: any[]) => Promise<void>;
declare const getFiles: (sp: SPRest, folderName: string) => Promise<import("@pnp/sp/files").IFileInfo[]>;
export { createFolder, uploadFiles, deleteFiles, getFiles };
//# sourceMappingURL=index.d.ts.map