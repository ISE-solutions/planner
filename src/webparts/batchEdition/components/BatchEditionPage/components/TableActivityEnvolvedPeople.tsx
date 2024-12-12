import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

const TableActivityDocuments = ({
  values,
  functionOptions,
  persons,
  control,
  setValue,
}) => {
  const handlePeopleChange = (
    field: string,
    value: any,
    id: string,
    keyId: string
  ) => {
    const indexActivity = values.findIndex((sc) => sc.id === id);
    const indexPeople = values[indexActivity].people.findIndex(
      (sc) => sc.keyId === keyId
    );

    setValue(
      `activities.${indexActivity}.people.${indexPeople}.${field}`,
      value
    );
  };

  const { tag } = useSelector((state: AppState) => state);
  const { dictTag } = tag;

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Dia',
        size: 170,
      },
      {
        accessorKey: 'name',
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
        accessorKey: 'people.person.label',
        Cell: ({ cell }) => {
          const { row } = cell;

          return (
            <Controller
              control={control}
              name={`activities.people.person`}
              defaultValue={{}}
              render={() => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={persons}
                  onChange={(event: any, newValue: any) => {
                    handlePeopleChange(
                      'person',
                      newValue,
                      row.original.id,
                      row.original.people.keyId
                    );
                    handlePeopleChange(
                      'function',
                      null,
                      row.original.id,
                      row.original.people.keyId
                    );
                  }}
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={row.original.people.person}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth name='person' label='' />
                  )}
                />
              )}
            />
          );
        },
        header: 'Pessoa',
      },
      {
        accessorKey: 'people.function.label',
        Cell: ({ cell }) => {
          const { row } = cell;
          const functions = [];

          row.original?.people?.person?.[
            `${PREFIX}Pessoa_Etiqueta_Etiqueta`
          ]?.forEach((tag) => {
            const fullTag = dictTag[tag?.[`${PREFIX}etiquetaid`]];

            if (
              fullTag?.[`${PREFIX}Etiqueta_Pai`]?.some(
                (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
              )
            ) {
              functions.push(fullTag);
            }
          });

          return (
            <Controller
              control={control}
              name={`schedules.people.function`}
              defaultValue={{}}
              render={() => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={functions}
                  onChange={(event: any, newValue: any) =>
                    handlePeopleChange(
                      'function',
                      newValue,
                      row.original.id,
                      row.original.people.keyId
                    )
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={row.original?.people?.function}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth name='function' label='' />
                  )}
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Função',
      },
    ],
    []
  );

  const rows = React.useMemo(() => {
    const result = [];
    values.forEach((act) => {
      act.people.forEach((pe) => {
        result.push({
          ...act,
          startTimeString: act.startTime.format('HH:mm'),
          spacesString: act.spaces.map((sp) => sp.label).join('; '),
          people: pe,
        });
      });
    });

    return result;
  }, [values]);

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
