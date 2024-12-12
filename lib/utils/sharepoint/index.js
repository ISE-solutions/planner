var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import '@pnp/sp/webs';
import '@pnp/sp/files';
import '@pnp/sp/folders';
const createFolder = (sp, name, titleRootFolder) => __awaiter(void 0, void 0, void 0, function* () {
    const arrName = name.split('/');
    var rootFolder = sp.web.lists.getByTitle(titleRootFolder).rootFolder;
    for (let index = 0; index < arrName.length; index++) {
        yield rootFolder.folders.add(arrName[index]);
        rootFolder = yield rootFolder.folders.getByName(arrName[index]);
    }
});
const uploadFiles = (sp, folderName, files) => __awaiter(void 0, void 0, void 0, function* () {
    var spFiles = sp.web.getFolderByServerRelativeUrl(folderName);
    for (let index = 0; index < files.length; index++) {
        yield spFiles.files.addChunked(files[index].nome, files[index].file);
    }
});
const deleteFiles = (sp, files) => __awaiter(void 0, void 0, void 0, function* () {
    for (let index = 0; index < files.length; index++) {
        var file = yield sp.web.getFileByServerRelativeUrl(files[index].relativeLink);
        yield file.delete();
    }
});
const getFiles = (sp, folderName) => __awaiter(void 0, void 0, void 0, function* () {
    let files = yield sp.web
        .getFolderByServerRelativeUrl(`${folderName}`)
        .files.get();
    files = files === null || files === void 0 ? void 0 : files.map((file) => ({
        nome: file.Name,
        tamanho: file.Length,
        relativeLink: file.ServerRelativeUrl,
    }));
    return files;
});
export { createFolder, uploadFiles, deleteFiles, getFiles };
//# sourceMappingURL=index.js.map