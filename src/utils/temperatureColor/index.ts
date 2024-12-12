import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';

export default (
  item: any,
  temperatureFather?: string
): { background: string; color: string } => {
  const temperature =
    item?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] || temperatureFather;

  switch (temperature) {
    case EFatherTag.RASCUNHO:
    default:
      return { background: '#e7ecef', color: '#323130' };

    case EFatherTag.RESERVA:
      return { background: '#fcf6bd', color: '#323130' };

    case EFatherTag.CONTRATADO:
      return { background: '#a9def9', color: '#323130' };

    case EFatherTag.PREPARADO:
      return { background: '#d0f4de', color: '#323130' };
  }
};
