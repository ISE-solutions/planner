import * as React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import { GROUP_FILTER } from '../constants';

import type {
  Config,
  ImmutableTree,
  BuilderProps,
} from '@react-awesome-query-builder/material'; // for TS example
import {
  Query,
  Builder,
  Utils as QbUtils,
} from '@react-awesome-query-builder/material';

import { Close } from '@material-ui/icons';
import { useConfirmation } from '~/hooks';
import { BoxBuilder } from '~/components/BoxBuilder';

interface FilterProps {
  formik: any;
  onClose: () => void;
  open: boolean;
  loading: boolean;
  group: GROUP_FILTER;
  configQB: Config;
  clearFilter: () => void;
  queryQB: {
    tree: ImmutableTree;
    config: Config;
  };
  setQuery: React.Dispatch<
    React.SetStateAction<{
      tree: ImmutableTree;
      config: Config;
    }>
  >;
  setGroup: React.Dispatch<React.SetStateAction<GROUP_FILTER>>;
}

export enum InputTypes {
  AUTOCOMPLETE,
  TEXT,
  DATE,
  DATETIME,
  NUMBER,
}

const Filter: React.FC<FilterProps> = ({
  formik,
  group,
  open,
  loading,
  onClose,
  queryQB,
  configQB,
  clearFilter,
  setQuery,
  setGroup,
}) => {
  const { confirmation } = useConfirmation();

  const renderBuilder = React.useCallback(
    (props: BuilderProps) => (
      <div className='query-builder-container' style={{ padding: '10px' }}>
        <div className='query-builder qb-lite'>
          <Builder {...props} />
        </div>
      </div>
    ),
    []
  );

  const handleSetGroup = (newValue) => {
    const sqlFilter = QbUtils.sqlFormat(queryQB.tree, configQB);

    if (sqlFilter) {
      confirmation.openConfirmation({
        title: 'Alteração de agrupador',
        description: 'Você pode perder seu filtro, deseja realmente alterar?',
        yesLabel: 'Sim',
        noLabel: 'Não',
        onConfirm: () => {
          setGroup(newValue);
          clearFilter();
        },
      });
    } else {
      setGroup(newValue);
      clearFilter();
    }
  };

  return (
    <SwipeableDrawer
      anchor='right'
      open={open}
      onClose={onClose}
      onOpen={() => null}
      disableBackdropClick
    >
      <Box
        display='flex'
        flexDirection='column'
        padding='1rem'
        minWidth='85vw'
        height='100vh'
      >
        <Box position='absolute' right='10px' top='10px'>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box
          display='flex'
          height='100%'
          flexDirection='column'
          marginBottom='1rem'
          style={{ gap: '10px' }}
        >
          <Box
            display='flex'
            maxWidth='15rem'
            width='100%'
            borderRadius='10px'
            padding='10px'
            style={{ gap: '10px' }}
          >
            <Typography
              variant='body1'
              color='primary'
              style={{ fontWeight: 'bold' }}
            >
              Agrupador
            </Typography>
            <Button
              fullWidth
              variant={
                group === GROUP_FILTER.PROGRAM ? 'contained' : 'outlined'
              }
              color='primary'
              onClick={() => handleSetGroup(GROUP_FILTER.PROGRAM)}
            >
              Programa
            </Button>
            <Button
              fullWidth
              variant={group === GROUP_FILTER.TURMA ? 'contained' : 'outlined'}
              color='primary'
              onClick={() => handleSetGroup(GROUP_FILTER.TURMA)}
            >
              Turma
            </Button>
            <Button
              fullWidth
              variant={group === GROUP_FILTER.DIA ? 'contained' : 'outlined'}
              color='primary'
              onClick={() => handleSetGroup(GROUP_FILTER.DIA)}
            >
              Dia
            </Button>
            <Button
              fullWidth
              variant={
                group === GROUP_FILTER.ATIVIDADE ? 'contained' : 'outlined'
              }
              color='primary'
              onClick={() => handleSetGroup(GROUP_FILTER.ATIVIDADE)}
            >
              Atividade
            </Button>
          </Box>

          <Box
            display='flex'
            width='100%'
            height='100%'
            flexDirection='column'
            style={{ gap: '10px' }}
          >
            <Typography
              variant='body1'
              color='primary'
              style={{ fontWeight: 'bold' }}
            >
              Filtro(s)
            </Typography>

            <BoxBuilder overflow='auto'>
              <Query
                {...configQB}
                value={queryQB.tree}
                renderBuilder={renderBuilder}
                onChange={(immutableTree, config) => {
                  setQuery((prevState) => ({
                    ...prevState,
                    tree: immutableTree,
                    config: config,
                  }));
                }}
              />
            </BoxBuilder>
          </Box>
        </Box>

        <Box
          width='100%'
          display='flex'
          marginBottom='2rem'
          justifyContent='flex-end'
          style={{ gap: '10px' }}
        >
          <Button onClick={() => formik.handleReset({})} color='primary'>
            Limpar
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            variant='contained'
            color='primary'
          >
            {loading ? (
              <CircularProgress size={20} style={{ color: '#fff' }} />
            ) : (
              'Pesquisar'
            )}
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default Filter;
