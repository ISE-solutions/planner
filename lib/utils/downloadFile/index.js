import { saveAs } from 'file-saver';
export default (url, nameFile) => {
    return new Promise((res, rej) => {
        var headers = new Headers();
        headers.append('pragma', 'no-cache');
        headers.append('cache-control', 'no-cache');
        headers.append('Content-Type', 'application/json');
        fetch(url, {
            method: 'GET',
            headers,
        })
            .then((response) => response.blob())
            .then((blob) => {
            saveAs(blob, nameFile);
            res('Download Concluído');
        })
            .catch((err) => {
            console.log(err);
        });
    });
};
//# sourceMappingURL=index.js.map