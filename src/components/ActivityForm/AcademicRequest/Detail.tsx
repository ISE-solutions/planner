import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import * as React from 'react';
import DetalhesSolicitacao from '~/components/DetalhesSolicitacao';
import { PREFIX } from '~/config/database';
import { EDeliveryType } from '~/config/enums';
import formatUrl from '~/utils/formatUrl';
import { IconClose } from './styles';

interface IRequestDetailProps {
  open: boolean;
  item: any;
  handleClose: () => void;
}

const RequestDetail: React.FC<IRequestDetailProps> = ({
  open,
  item,
  handleClose,
}) => {
  const dataDetail = {
    items: [
      {
        title: 'Informações',
        coluna1: [
          {
            title: 'Momento Entrega',
            value: EDeliveryType[item?.delivery],
          },
          {
            title: 'Data de Entrega',
            value:
              item?.deliveryDate &&
              item?.deliveryDate?.format('DD/MM/YYYY HH:mm'),
          },
        ],
        coluna2: [
          {
            title: 'Prazo Entrega',
            value: item?.deadline,
          },
          {
            title: 'Link',
            value: (
              <a href={formatUrl(item?.link)} target='_blank'>
                Acesse
              </a>
            ),
          },
          {
            title: 'Nome (Moodle)',
            value: item?.nomemoodle,
          },
        ],
        linha: [
          {
            title: 'Descrição',
            value: item?.description,
          },
          {
            title: 'Observação',
            value: item?.observation,
          },
          {
            title: 'Equipamentos',
            value: item?.equipments
              ?.map((e) => e?.[`${PREFIX}nome`])
              ?.join(', '),
          },
          {
            title: 'Recursos Finitos',
            value: item?.finiteResource
              ?.map((e) => e?.[`${PREFIX}nome`])
              ?.join(', '),
          },
          {
            title: 'Recursos Infinitos',
            value: item?.infiniteResource
              ?.map((e) => e?.[`${PREFIX}nome`])
              ?.join(', '),
          },
          {
            title: 'Outro',
            value: item?.other,
          },
        ],
      },
      {
        title: 'Pessoas Envolvidas',
        table: {
          columns: [
            {
              title: 'Pessoa',
              key: `person.${PREFIX}nome`,
            },
            {
              title: 'Função',
              key: `function.${PREFIX}nome`,
            },
          ],
          rows: item?.people || [],
        },
      },
    ],
  };
  return (
    <Dialog open={open} fullWidth maxWidth='md'>
      <DialogTitle>
        Requisição Acadêmica
        <IconClose onClick={handleClose}>
          <Close />
        </IconClose>
      </DialogTitle>
      <DialogContent>
        <DetalhesSolicitacao solicitacao={dataDetail} />
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetail;
