import * as React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import DetalhesSolicitacao from '~/components/DetalhesSolicitacao';
import { EUso } from '~/config/enums';
import { Close } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IModalDetailsProps {
  open: boolean;
  item: any;
  onClose: () => void;
}

const ModalDetail: React.FC<IModalDetailsProps> = ({ open, item, onClose }) => {
  const { tag, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictPeople } = person;

  const dataDetail = () => {
    const people = item?.[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => ({
      person: dictPeople[e?.[`_${PREFIX}pessoa_value`]]?.[`${PREFIX}nome`],
      function: dictTag[e?.[`_${PREFIX}funcao_value`]]?.[`${PREFIX}nome`],
    }));

    const names = item?.[`${PREFIX}Atividade_NomeAtividade`]?.map((name) => ({
      ...name,
      use: EUso[name?.[`${PREFIX}uso`]],
    }));

    return {
      items: [
        {
          title: 'Dados da Atividade não Acadêmica',
          coluna1: [
            {
              title: 'Nome',
              value: item?.[`${PREFIX}nome`],
            },
            {
              title: 'Início',
              value: item?.[`${PREFIX}inicio`],
            },
            {
              title: 'Duração',
              value: item?.[`${PREFIX}duracao`],
            },
            {
              title: 'Fim',
              value: item?.[`${PREFIX}fim`],
            },
          ],
          coluna2: [
            {
              title: 'Quantidade de sessões',
              value: item?.[`${PREFIX}quantidadesessao`],
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
              title: 'Espaços',
              value: item?.[`${PREFIX}Atividade_Espaco`]
                ?.map((e) => e?.[`${PREFIX}nome`])
                ?.join(', '),
            },
            {
              title: 'Tema',
              value: item?.[`${PREFIX}temaaula`],
            },
          ],
        },
        {
          title: 'Nome Fantasia',
          table: {
            columns: [
              {
                title: 'Nome (PT)',
                key: `${PREFIX}nome`,
              },
              {
                title: 'Nome (EN)',
                key: `${PREFIX}nomeen`,
              },
              {
                title: 'Nome (ES)',
                key: `${PREFIX}nomees`,
              },
              {
                title: 'Uso',
                key: 'use',
              },
            ],
            rows: names,
          },
        },
        {
          title: 'Pessoas Envolvidas',
          table: {
            columns: [
              {
                title: 'Pessoa',
                key: `person`,
              },
              {
                title: 'Função',
                key: 'function',
              },
            ],
            rows: people,
          },
        },
        {
          title: 'Observação',
          coluna1: [],
          coluna2: [],
          custom: () => {
            return (
              <div
                style={{ wordBreak: 'break-all' }}
                dangerouslySetInnerHTML={{
                  __html: item?.[`${PREFIX}observacao`],
                }}
              ></div>
            );
          },
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
