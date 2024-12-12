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
          title: 'Dados da Pessoa',
          coluna1: [
            {
              title: 'Nome',
              value: item?.[`${PREFIX}nome`],
            },
            {
              title: 'Sobrenome',
              value: item?.[`${PREFIX}sobrenome`],
            },
            {
              title: 'Nome Preferido',
              value: item?.[`${PREFIX}nomepreferido`],
            },
            {
              title: 'Título',
              value: item?.[`${PREFIX}Titulo`]?.[`${PREFIX}nome`],
            },
            {
              title: 'E-mail',
              value: item?.[`${PREFIX}email`],
            },
            {
              title: 'Chefe de Departamento',
              value: item?.[`${PREFIX}Pessoa_AreaResponsavel`]
                ?.map((are) => are?.[`${PREFIX}nome`])
                .join(', '),
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
              title: 'E-mail Secundário',
              value: item?.[`${PREFIX}emailsecundario`],
            },
            {
              title: 'Celular',
              value: item?.[`${PREFIX}celular`],
            },
            {
              title: 'Escola de Origem',
              value: item?.[`${PREFIX}EscolaOrigem`]?.[`${PREFIX}nome`],
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
          linha: [
            {
              title: 'Etiqueta(s)',
              value: item?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]
                ?.map((e) => e[`${PREFIX}nome`])
                ?.join(', '),
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
          aria-label='close'
          onClick={onClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DetalhesSolicitacao solicitacao={dataDetail()} />
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default ModalDetail;
