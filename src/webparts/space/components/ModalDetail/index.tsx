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
import { EUso } from '~/config/enums';
import { getFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import { Close } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IModalDetailsProps {
  open: boolean;
  item: any;
  onClose: () => void;
}

const ModalDetail: React.FC<IModalDetailsProps> = ({ open, item, onClose }) => {
  const [anexos, setAnexos] = React.useState([]);
  const { tag, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;

  React.useEffect(() => {
    if (item) {
      getFiles(
        sp,
        `Anexos Interno/Espaco/${moment(item?.createdon).format('YYYY')}/${
          item?.[`${PREFIX}espacoid`]
        }`
      ).then((files) => {
        setAnexos(files);
      });
    }
  }, [item]);

  const dictPeople = React.useMemo(() => {
    return person?.persons?.reduce((acc, person) => {
      acc[person?.[`${PREFIX}pessoaid`]] = person?.[`${PREFIX}nome`];
      return acc;
    }, {});
  }, [person]);

  const dictFunction = React.useMemo(() => {
    return tag?.tags?.reduce((acc, func) => {
      acc[func?.[`${PREFIX}etiquetaid`]] = func?.[`${PREFIX}nome`];
      return acc;
    }, {});
  }, [tag]);

  const dataDetail = () => {
    const names = item?.[`${PREFIX}Espaco_NomeEspaco`]?.map((name) => ({
      ...name,
      use: dictTag?.[name?.[`_${PREFIX}uso_value`]]?.[`${PREFIX}nome`],
    }));

    const capacities = item?.[`${PREFIX}Espaco_CapacidadeEspaco`]?.map(
      (name) => ({
        ...name,
        use: dictTag?.[name?.[`_${PREFIX}uso_value`]]?.[`${PREFIX}nome`],
      })
    );

    const people = item?.[`${PREFIX}Espaco_PessoasEnvolvidas`]?.map((e) => ({
      person: dictPeople?.[e?.[`_${PREFIX}pessoa_value`]],
      function: dictFunction?.[e?.[`_${PREFIX}funcao_value`]],
    }));

    return {
      anexos: anexos,
      items: [
        {
          title: 'Dados do Espaço',
          coluna1: [
            {
              title: 'Nome',
              value: item?.[`${PREFIX}nome`],
            },
            {
              title: 'E-mail',
              value: item?.[`${PREFIX}email`],
            },
            {
              title: 'Ativo',
              value: item?.[`${PREFIX}ativo`] ? 'Sim' : 'Não',
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
              title: 'Criado em',
              value: moment(item?.createdon).format('DD/MM/YYYY HH:mm:ss'),
            },
          ],
          linha: [
            {
              title: 'Etiquetas',
              value: item?.[`${PREFIX}Espaco_Etiqueta_Etiqueta`]
                .map((e) => e?.[`${PREFIX}nome`])
                .join(', '),
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
          title: 'Capacidade',
          table: {
            columns: [
              {
                title: 'Quantidade',
                key: `${PREFIX}quantidade`,
              },

              {
                title: 'Uso',
                key: 'use',
              },
            ],
            rows: capacities,
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
