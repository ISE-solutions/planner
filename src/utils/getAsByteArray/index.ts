export default async (file) => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([file], { type: file.type });
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);

    reader.onload = (e) => {
      const bodyContents = e.target.result;
      // @ts-ignore
      const buffer = new Uint8Array(bodyContents);

      resolve(buffer);
    };
  });
};
