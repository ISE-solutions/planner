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
import { EDeliveryType, EFatherTag, EUso, TYPE_RESOURCE } from '~/config/enums';
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
  const { tags, dictTag } = tag;
  const { dictPeople } = person;

  const dictFunction = React.useMemo(() => {
    return tags
      ?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
        )
      )
      ?.reduce((acc, func) => {
        acc[func?.[`${PREFIX}etiquetaid`]] = func?.[`${PREFIX}nome`];
        return acc;
      }, {});
  }, [tags]);

  const dataDetail = () => {
    const people = item?.[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => ({
      person: dictPeople[e?.[`_${PREFIX}pessoa_value`]]?.[`${PREFIX}nome`],
      function: dictFunction[e?.[`_${PREFIX}funcao_value`]]?.[`${PREFIX}nome`],
    }));

    const documents = item?.[`${PREFIX}Atividade_Documento`]?.map((e) => ({
      name: e?.[`${PREFIX}nome`],
      link: e?.[`${PREFIX}link`],
      fonte: e?.[`${PREFIX}fonte`]?.toLocaleUpperCase(),
      entrega: EDeliveryType[e?.[`${PREFIX}entrega`]],
    }));

    const names = item?.[`${PREFIX}Atividade_NomeAtividade`]?.map((name) => ({
      ...name,
      use: dictTag?.[name?.[`_${PREFIX}uso_value`]]?.[`${PREFIX}nome`],
    }));

    return {
      items: [
        {
          title: 'Dados da Atividade Acadêmica',
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
              title: 'Área Acadêmica',
              value: item?.[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
            },
            {
              title: 'Espaços',
              value: item?.[`${PREFIX}Atividade_Espaco`]
                .map((e) => e?.[`${PREFIX}nome`])
                .join(', '),
            },
            {
              title: 'Equipamentos/Outros',
              value: item?.[`${PREFIX}Atividade_Equipamentos`]
                .map((e) => e?.[`${PREFIX}nome`])
                .join(', '),
            },
            {
              title: 'Recurso Finito',
              value: item?.[`${PREFIX}Atividade_RecursoFinitoInfinito`]
                ?.filter(
                  (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
                )
                .map((e) => e?.[`${PREFIX}nome`])
                .join(', '),
            },
            {
              title: 'Recurso Infinito',
              value: item?.[`${PREFIX}Atividade_RecursoFinitoInfinito`]
                ?.filter(
                  (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
                )
                .map((e) => e?.[`${PREFIX}nome`])
                .join(', '),
            },
            {
              title: 'Tema',
              value: item?.[`${PREFIX}temaaula`],
            },
            {
              title: 'Descrição/Objetivo',
              value: item?.[`${PREFIX}descricaoobjetivo`],
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
          title: 'Documentos',
          table: {
            columns: [
              {
                title: 'Nome',
                key: `name`,
              },
              {
                title: 'Fonte',
                key: 'fonte',
              },
              {
                title: 'Entrega',
                key: 'entrega',
              },
              {
                title: 'Link',
                key: 'link',
              },
            ],
            rows: documents,
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
