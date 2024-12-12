import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { EDeliveryType } from '~/config/enums';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

const TableActivityDocuments = ({ values, control, setValue }) => {
  const handleDocumentChange = (
    field: string,
    value: any,
    id: string,
    keyId: string
  ) => {
    const indexActivity = values.findIndex((sc) => sc.id === id);
    const indexName = values[indexActivity].documents.findIndex(
      (sc) => sc.keyId === keyId
    );

    setValue(
      `activities.${indexActivity}.documents.${indexName}.${field}`,
      value
    );
  };

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Dia',
        size: 170,
      },
      {
        accessorKey: 'activityName',
        header: 'Nome Atividade',
        size: 270,
      },
      {
        accessorKey: 'startTimeString',
        size: 160,
        header: 'Início',
      },
      {
        accessorKey: 'theme',
        header: 'Tema',
        size: 300,
      },
      {
        accessorKey: 'typeLabel',
        header: 'Tipo atividade',
        filterVariant: 'text',
        size: 170,
        enableColumnFilter: true,
      },
      {
        accessorKey: 'name',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`name`}
              defaultValue={{}}
              render={({ field }) => (
                <TextField
                  type='text'
                  fullWidth
                  value={row.original?.doc?.name}
                  onChange={(event) =>
                    handleDocumentChange(
                      'name',
                      event.target.value,
                      row.original.id,
                      row.original.doc.keyId
                    )
                  }
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Nome',
      },
      {
        accessorKey: 'doc.fonte',
        size: 270,
        header: 'Fonte',
      },
      {
        accessorKey: 'link',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`link`}
              defaultValue={{}}
              render={() => (
                <TextField
                  type='text'
                  fullWidth
                  value={row.original?.doc?.link}
                  onChange={(event) =>
                    handleDocumentChange(
                      'link',
                      event.target.value,
                      row.original.id,
                      row.original.doc.keyId
                    )
                  }
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Link',
      },
      {
        accessorKey: 'delivery',
        Cell: ({ cell }) => {
          const { row } = cell;

          return (
            <Controller
              control={control}
              name={`doc.delivery`}
              defaultValue={''}
              render={({ field }) => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={Object.keys(EDeliveryType)}
                  onChange={(event: any, newValue: any) =>
                    handleDocumentChange(
                      'delivery',
                      newValue,
                      row.original.id,
                      row.original.doc.keyId
                    )
                  }
                  getOptionLabel={(option) => EDeliveryType[option]}
                  value={row.original.doc.delivery}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth name='delivery' label='' />
                  )}
                />
              )}
            />
          );
        },
        size: 300,
        header: 'Momento entrega',
      },
    ],
    []
  );

  const rows = React.useMemo(() => {
    const result = [];
    values.forEach((act) => {
      act.documents.forEach((dc) => {
        result.push({
          ...act,
          doc: dc,
          activityName: act.name,
          startTimeString: act.startTime.format('HH:mm'),
          spacesString: act.spaces.map((sp) => sp.label).join('; '),
        });
      });
    });

    return result;
  }, values);

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableColumnPinning: true,
    enableRowPinning: true,
    enableStickyHeader: true,
    layoutMode: 'grid-no-grow',
    localization: MRT_Localization_PT_BR,
    rowPinningDisplayMode: 'top-and-bottom',
    muiTableContainerProps: { sx: { height: 'calc(100vh - 25rem)' } },
    initialState: {
      columnPinning: { left: ['mrt-row-actions'], right: [] },
    },
  });

  return (
    <Box overflow='auto'>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default TableActivityDocuments;
