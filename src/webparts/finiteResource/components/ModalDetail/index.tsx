import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import DetalhesSolicitacao from '~/components/DetalhesSolicitacao';
import { Close } from '@material-ui/icons';

interface IModalDetailsProps {
  open: boolean;
  item: any;
  onClose: () => void;
}

const ModalDetail: React.FC<IModalDetailsProps> = ({ open, item, onClose }) => {
  const dataDetail = () => {
    return {
      items: [
        {
          title: 'Dados do Recurso Finito',
          coluna1: [
            {
              title: 'Nome',
              value: item?.[`${PREFIX}nome`],
            },
            {
              title: 'Limitação',
              value: item?.[`${PREFIX}limitacao`],
            },
            {
              title: 'Quantidade',
              value: item?.[`${PREFIX}quantidade`],
            },
            {
              title: 'Tipo Desativação',
              value: item?.[`${PREFIX}tipodesativacao`]?.toLocaleUpperCase(),
              hide: item?.[`${PREFIX}ativo`],
            },
            {
              title: 'Início Desativação',
              value:
                item?.[`${PREFIX}iniciodesativacao`] &&
                moment(item?.[`${PREFIX}iniciodesativacao`]).format(
                  'DD/MM/YYYY HH:mm:ss'
                ),
              hide:
                item?.[`${PREFIX}ativo`] ||
                item?.[`${PREFIX}tipodesativacao`] === 'definitivo',
            },
            {
              title: 'Fim Desativação',
              value:
                item?.[`${PREFIX}fimdesativacao`] &&
                moment(item?.[`${PREFIX}fimdesativacao`]).format(
                  'DD/MM/YYYY HH:mm:ss'
                ),
              hide:
                item?.[`${PREFIX}ativo`] ||
                item?.[`${PREFIX}tipodesativacao`] === 'definitivo',
            },
          ],
          coluna2: [
            {
              title: 'Tipo',
              value: item?.[`${PREFIX}Tipo`]?.[`${PREFIX}nome`],
            },
            {
              title: 'Ativo',
              value: item?.[`${PREFIX}ativo`] ? 'Sim' : 'Não',
            },
            {
              title: 'Criado em',
              value: moment(item?.createdon).format('DD/MM/YYYY HH:mm:ss'),
            },
          ],
        },
      ],
    };
  };

  return (
    <Dialog open={open} fullWidth maxWidth='lg' onClose={onClose}>
      <DialogTitle>
      <IconButton
          aria-label="close"
          onClick={onClose}
          style={{position: 'absolute', right: 8, top: 8}}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DetalhesSolicitacao solicitacao={dataDetail()} />
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDetail;