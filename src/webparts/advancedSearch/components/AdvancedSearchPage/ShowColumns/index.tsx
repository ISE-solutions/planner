import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import { BoxCloseIcon } from '~/components/AddTeam/styles';
import { Close } from '@material-ui/icons';
import * as _ from 'lodash';

interface IShowColumns {
  open: boolean;
  onClose: () => void;
  columns: any[];
  setColumns: React.Dispatch<any>;
}

const ShowColumns: React.FC<IShowColumns> = ({
  open,
  onClose,
  columns,
  setColumns,
}) => {
  const [localColumn, setLocalColumn] = React.useState([]);
  const [showAllColumns, setShowColumns] = React.useState(false);

  React.useEffect(() => {
    setLocalColumn(_.cloneDeep(columns));
  }, [columns]);

  const handleChangeColumn = (id) => {
    const index = columns.findIndex((e) => e.id === id);
    const newColumns = _.cloneDeep(localColumn);
    newColumns[index].options.display = !newColumns[index].options.display;

    setLocalColumn(newColumns);
  };

  const handleShowHideColumn = () => {
    const newColumn = _.cloneDeep(localColumn);

    const newColumns = newColumn.map((co) => {
      if (co.hideColumn) {
        return co;
      }
      return {
        ...co,
        options: { ...(co?.options || {}), display: showAllColumns },
      };
    });

    setLocalColumn(newColumns);
    setShowColumns(!showAllColumns);
  };

  const handleApply = () => {
    setColumns(localColumn);
    onClose();
  };

  const columnsGrouped = React.useMemo(
    () => _.groupBy(localColumn, (e) => e.group),
    [localColumn]
  );

  return (
    <SwipeableDrawer
      anchor='right'
      open={open}
      onClose={onClose}
      onOpen={() => null}
      disableBackdropClick
    >
      <BoxCloseIcon>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </BoxCloseIcon>

      <Box
        padding='2rem'
        minWidth='30rem'
        flexDirection='column'
        maxHeight='100vh'
        height='100%'
        display='flex'
        style={{ gap: '10px' }}
      >
        <Box display='flex' justifyContent='space-between' paddingRight='2rem'>
          <Typography
            variant='h6'
            color='textPrimary'
            style={{ fontWeight: 'bold' }}
          >
            Mostrar colunas
          </Typography>

          <Button
            variant='contained'
            color='primary'
            onClick={handleShowHideColumn}
          >
            {showAllColumns ? 'Selecionar todas' : 'Deselecionar todas'}
          </Button>
        </Box>
        <Box
          display='flex'
          flexDirection='column'
          flex='1 0 auto'
          overflow='auto'
          maxHeight='calc(100vh - 12rem)'
        >
          {Object.keys(columnsGrouped)?.map((key) => (
            <Box display='flex' flexDirection='column' style={{ gap: '10px' }}>
              <Typography>{key}</Typography>
              <Box display='flex' flexDirection='column'>
                {columnsGrouped[key]
                  ?.filter((e) => !e?.hideColumn)
                  .map((column, index) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          key={column?.name}
                          checked={column?.options?.display}
                          // value={column?.options?.display}
                          onChange={() => handleChangeColumn(column.id)}
                          name={column?.name}
                          color='primary'
                        />
                      }
                      label={column?.label}
                    />
                  ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Box display='flex' justifyContent='flex-end' style={{ gap: '1rem' }}>
          <Button color='primary' onClick={onClose}>
            Cancelar
          </Button>
          <Button variant='contained' color='primary' onClick={handleApply}>
            Aplicar
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default ShowColumns;
