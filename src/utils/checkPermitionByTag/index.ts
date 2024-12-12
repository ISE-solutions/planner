import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';

export default (allTags: any[], myTags: any[], permition: EFatherTag) => {
  const dictTag = new Map();

  allTags?.forEach((tag) => {
    dictTag.set(tag?.[`${PREFIX}etiquetaid`], tag);
  });

  return myTags?.some((myTag) => {
    const tag = dictTag.get(myTag?.[`${PREFIX}etiquetaid`]);

    return (
      tag?.[`${PREFIX}nome`] === permition ||
      tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
        (fatherTag) => fatherTag?.[`${PREFIX}nome`] === EFatherTag.PLANEJAMENTO
      )
    );
  });
};
