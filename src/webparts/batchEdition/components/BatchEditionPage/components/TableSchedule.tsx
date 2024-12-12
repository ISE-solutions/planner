import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';

import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { KeyboardDatePicker } from '@material-ui/pickers';
import * as _ from 'lodash';

const TableSchedule = ({
  control,
  values,
  setValue,
  handleScheduleDateChange,
  modalityDayOptions,
  moduleOptions,
  temperatureOptions,
  persons,
  functionOptions,
}) => {
  const handlePeopleChange = (
    field: string,
    value: any,
    original: any,
    rowIndex: number
  ) => {
    setValue(`schedules.${rowIndex}.peopleRender.${field}`, value);
    setValue(
      `schedules.${original.parentIndex}.people[${original.idx}].${field}`,
      value
    );
  };

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'dateString',
        Cell: ({ cell }) => {
          const { row } = cell;

          if (row.original.blocked) {
            return (
              <Controller
                control={control}
                name={`schedules.${row.index}.date`}
                defaultValue={''}
                render={({ field }) => (
                  <>{field?.value?.clone()?.format('DD/MM/YYYY')}</>
                )}
              />
            );
          }
          return (
            <Controller
              control={control}
              name={`schedules.${row.index}.date`}
              render={({ field }) => {
                return (
                  <KeyboardDatePicker
                    clearable
                    autoOk
                    fullWidth
                    disabled={row.original.blocked}
                    variant='inline'
                    format='DD/MM/YYYY'
                    label=''
                    value={field.value}
                    onChange={(newValue) =>
                      handleScheduleDateChange(newValue, row.original.id)
                    }
                  />
                );
              }}
            />
          );
        },
        header: 'Data',
        size: 170,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'module.label',
        Cell: ({ cell }) => {
          const { row } = cell;

          if (row.original.blocked) {
            return (
              <Controller
                control={control}
                name={`schedules.${row.original.parentIndex}.module.label`}
                defaultValue={''}
                render={({ field }) => <>{field.value}</>}
              />
            );
          }

          return (
            <Controller
              control={control}
              name={`schedules.${row.index}.module`}
              defaultValue={{}}
              render={({ field }) => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  disabled={row.original.blocked}
                  options={moduleOptions}
                  onChange={(event: any, newValue: any) =>
                    setValue(`schedules.${row.index}.module`, newValue)
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={field?.value}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label='' />
                  )}
                />
              )}
            />
          );
        },
        header: 'Módulo',
        size: 270,
      },
      {
        accessorKey: 'modality.label',
        Cell: ({ cell }) => {
          const { row } = cell;

          if (row.original.blocked) {
            return (
              <Controller
                control={control}
                name={`schedules.${row.original.parentIndex}.modality.label`}
                defaultValue={''}
                render={({ field }) => <>{field.value}</>}
              />
            );
          }
          return (
            <Controller
              control={control}
              name={`schedules.${row.index}.modality`}
              defaultValue={{}}
              render={({ field }) => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  disabled={row.original.blocked}
                  options={modalityDayOptions}
                  onChange={(event: any, newValue: any) =>
                    setValue(`schedules.${row.index}.modality`, newValue)
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={field?.value}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label='' />
                  )}
                />
              )}
            />
          );
        },
        header: 'Modalidade',
        size: 270,
      },
      {
        accessorKey: 'link',
        Cell: ({ cell }) => {
          const { row } = cell;

          if (row.original.blocked) {
            return (
              <Controller
                control={control}
                name={`schedules.${row.original.parentIndex}.link`}
                defaultValue={''}
                render={({ field }) => <>{field.value}</>}
              />
            );
          }

          return (
            <Controller
              control={control}
              name={`schedules.${row.index}.link`}
              render={({ field }) => (
                <TextField
                  type='url'
                  fullWidth
                  disabled={row.original.blocked}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          );
        },
        size: 200,
        header: 'Link',
      },
      {
        accessorKey: 'temperature.label',
        Cell: ({ cell }) => {
          const { row } = cell;

          if (row.original.blocked) {
            return (
              <Controller
                control={control}
                name={`schedules.${row.original.parentIndex}.temperature.label`}
                defaultValue={''}
                render={({ field }) => <>{field.value}</>}
              />
            );
          }

          return (
            <Controller
              control={control}
              name={`schedules.${row.index}.temperature`}
              defaultValue={{}}
              render={({ field }) => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  disabled={row.original.blocked}
                  options={temperatureOptions}
                  onChange={(event: any, newValue: any) =>
                    setValue(`schedules.${row.index}.temperature`, newValue)
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={field?.value}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label='' />
                  )}
                />
              )}
            />
          );
        },
        header: 'Temperatura/Status',
        size: 270,
      },
      {
        accessorKey: 'peopleRender.function.label',
        Cell: ({ cell }) => {
          const { row } = cell;

          return (
            <Controller
              control={control}
              name={`schedules.${row.original.parentIndex}.people[${row.original.idx}].function`}
              defaultValue={{}}
              render={() => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={functionOptions}
                  onChange={(event: any, newValue: any) =>
                    handlePeopleChange(
                      'function',
                      newValue,
                      row.original,
                      row.index
                    )
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={row.original?.peopleRender?.function}
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
      {
        accessorKey: 'peopleRender.person.label',
        Cell: ({ cell }) => {
          const { row } = cell;

          return (
            <Controller
              control={control}
              name={`schedules.${row.original.parentIndex}.people[${row.original.idx}].person`}
              defaultValue={{}}
              render={() => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={persons}
                  onChange={(event: any, newValue: any) =>
                    handlePeopleChange(
                      'person',
                      newValue,
                      row.original,
                      row.index
                    )
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={row.original.peopleRender.person}
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
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: values,
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
      <MaterialReactTable table={table} />{' '}
    </Box>
  );
};

export default TableSchedule;
