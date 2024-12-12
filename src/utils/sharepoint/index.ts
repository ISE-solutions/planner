import { SPRest } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/files';
import '@pnp/sp/folders';

const createFolder = async (
  sp: SPRest,
  name: string,
  titleRootFolder: string
) => {
  const arrName = name.split('/');
  var rootFolder = sp.web.lists.getByTitle(titleRootFolder).rootFolder;

  for (let index = 0; index < arrName.length; index++) {
    await rootFolder.folders.add(arrName[index]);
    rootFolder = await rootFolder.folders.getByName(arrName[index]);
  }
};

const uploadFiles = async (sp: SPRest, folderName: string, files: any[]) => {
  var spFiles = sp.web.getFolderByServerRelativeUrl(folderName);

  for (let index = 0; index < files.length; index++) {
    await spFiles.files.addChunked(files[index].nome, files[index].file);
  }
};

const deleteFiles = async (sp: SPRest, files: any[]) => {
  for (let index = 0; index < files.length; index++) {
    var file = await sp.web.getFileByServerRelativeUrl(
      files[index].relativeLink
    );
    await file.delete();
  }
};

const getFiles = async (sp: SPRest, folderName: string) => {
  let files = await sp.web
    .getFolderByServerRelativeUrl(`${folderName}`)
    .files.get();

  files = files?.map(
    (file) =>
      ({
        nome: file.Name,
        tamanho: file.Length,
        relativeLink: file.ServerRelativeUrl,
      } as any)
  );

  return files;
};

export { createFolder, uploadFiles, deleteFiles, getFiles };
