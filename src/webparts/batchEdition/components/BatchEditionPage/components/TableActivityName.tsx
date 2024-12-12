import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

const TableActivityName = ({ values, control, setValue, useOptions }) => {
  const handleNameChange = (
    field: string,
    value: any,
    id: string,
    keyId: string
  ) => {
    const indexActivity = values.findIndex((sc) => sc.id === id);
    const indexName = values[indexActivity].names.findIndex(
      (sc) => sc.keyId === keyId
    );

    setValue(`activities.${indexActivity}.names.${indexName}.${field}`, value);
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
        accessorKey: 'spacesString',
        header: 'Espaços',
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
        accessorKey: 'name.name',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.name.name`}
              defaultValue={{}}
              render={({ field }) => (
                <TextField
                  type='text'
                  fullWidth
                  value={row.original?.name?.name}
                  onChange={(event) =>
                    handleNameChange(
                      'name',
                      event.target.value,
                      row.original.id,
                      row.original.name.keyId
                    )
                  }
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Nome (PT)',
      },
      {
        accessorKey: 'name.nameEn',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.name.nameEn`}
              defaultValue={{}}
              render={({ field }) => (
                <TextField
                  type='text'
                  fullWidth
                  value={row.original?.name?.nameEn}
                  onChange={(event) =>
                    handleNameChange(
                      'nameEn',
                      event.target.value,
                      row.original.id,
                      row.original.name.keyId
                    )
                  }
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Nome (EN)',
      },
      {
        accessorKey: 'name.nameEs',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.name.nameEs`}
              defaultValue={{}}
              render={({ field }) => (
                <TextField
                  type='text'
                  fullWidth
                  value={row.original?.name?.nameEs}
                  onChange={(event) =>
                    handleNameChange(
                      'nameEs',
                      event.target.value,
                      row.original.id,
                      row.original.name.keyId
                    )
                  }
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Nome (ES)',
      },
      {
        accessorKey: 'people.name.use',
        Cell: ({ cell }) => {
          const { row } = cell;

          return (
            <Controller
              control={control}
              name={`people.name.use`}
              defaultValue={{}}
              render={() => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={useOptions}
                  onChange={(event: any, newValue: any) =>
                    handleNameChange(
                      'use',
                      newValue,
                      row.original.id,
                      row.original.name.keyId
                    )
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={row.original.name.use}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth name='use' label='' />
                  )}
                />
              )}
            />
          );
        },
        header: 'Uso',
      },
    ],
    []
  );

  const rows = React.useMemo(() => {
    const result = [];
    values.forEach((act) => {
      act.names.forEach((pe) => {
        result.push({
          ...act,
          activityName: act.name,
          startTimeString: act.startTime.format('HH:mm'),
          spacesString: act.spaces.map((sp) => sp.label).join('; '),
          name: pe,
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

export default TableActivityName;
