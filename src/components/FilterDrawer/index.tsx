import * as React from 'react';
import {
  Box,
  Button,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import type {
  Config,
  ImmutableTree,
  BuilderProps,
} from '@react-awesome-query-builder/material'; // for TS example
import { Query, Builder } from '@react-awesome-query-builder/material';
import { BoxBuilder } from '../BoxBuilder';

interface IFIlterProps {
  open: boolean;
  onClose: () => void;
  applyFilter: () => void;
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
}

const FilterDrawer: React.FC<IFIlterProps> = ({
  open,
  onClose,
  queryQB,
  configQB,
  clearFilter,
  applyFilter,
  setQuery,
}) => {
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
        width='60vw'
        height='100vh'
      >
        <Box position='absolute' right='10px' top='10px'>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box
          display='flex'
          width='100%'
          height='100%'
          flexDirection='column'
          marginBottom='1rem'
          style={{ gap: '10px' }}
        >
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
          <Button onClick={clearFilter} color='primary'>
            Limpar
          </Button>
          <Button onClick={applyFilter} variant='contained' color='primary'>
            Aplicar
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default FilterDrawer;
