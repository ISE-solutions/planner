import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
export default (allTags, myTags, permition) => {
    const dictTag = new Map();
    allTags === null || allTags === void 0 ? void 0 : allTags.forEach((tag) => {
        dictTag.set(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`], tag);
    });
    return myTags === null || myTags === void 0 ? void 0 : myTags.some((myTag) => {
        var _a;
        const tag = dictTag.get(myTag === null || myTag === void 0 ? void 0 : myTag[`${PREFIX}etiquetaid`]);
        return ((tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) === permition ||
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((fatherTag) => (fatherTag === null || fatherTag === void 0 ? void 0 : fatherTag[`${PREFIX}nome`]) === EFatherTag.PLANEJAMENTO)));
    });
};
//# sourceMappingURL=index.js.map