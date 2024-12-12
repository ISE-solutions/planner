import * as React from 'react';
import { Box, Checkbox, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { KeyboardTimePicker } from '@material-ui/pickers';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { PREFIX } from '~/config/database';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@material-ui/icons';
import { TYPE_ACTIVITY_LABEL } from '~/config/enums';

const TableActivity = ({
  control,
  setValue,
  values,
  planningActivities,
  temperatureOptions,
  areaOptions,
  courseOptions,
  spaces,
}) => {
  const activitiesOptions = React.useMemo(() => {
    return planningActivities?.map((ac) => ({
      ...ac,
      value: ac?.[`${PREFIX}nome`],
    }));
  }, [planningActivities]);

  const columns = React.useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Dia',
        filterVariant: 'date-range',
        size: 170,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'typeLabel',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.typeLabel`}
              defaultValue={{}}
              render={({ field }) => <>{field.value}</>}
            />
          );
        },
        header: 'Tipo atividade',
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
              name={`activities.${row.index}.nameObj`}
              defaultValue={{}}
              render={({ field }) => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={activitiesOptions}
                  onChange={(event: any, newValue: any) => {
                    setValue(`activities.${row.index}.nameObj`, newValue);
                    setValue(`activities.${row.index}.name`, newValue.value);
                    setValue(
                      `activities.${row.index}.type`,
                      newValue?.[`${PREFIX}tipo`]
                    );
                    setValue(
                      `activities.${row.index}.${PREFIX}tipo`,
                      newValue?.[`${PREFIX}tipo`]
                    );
                    setValue(
                      `activities.${row.index}.typeLabel`,
                      TYPE_ACTIVITY_LABEL?.[newValue[`${PREFIX}tipo`]]
                    );
                  }}
                  getOptionSelected={(option, value) => option.value === value}
                  getOptionLabel={(option) => option.value || ''}
                  value={field.value}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth name='name' label='Nome da Atividade' />
                  )}
                />
              )}
            />
          );
        },
        header: 'Nome da Atividade',
        size: 270,
      },
      {
        accessorKey: 'startTimeString',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.startTime`}
              render={({ field }) => (
                <KeyboardTimePicker
                  ampm={false}
                  fullWidth
                  cancelLabel='Cancelar'
                  invalidDateMessage='Formato inválido'
                  label=''
                  value={field.value}
                  onChange={(newValue) => {
                    setValue(`activities.${row.index}.startTime`, newValue);
                    const dur = values?.[row.index]?.duration;

                    if (dur) {
                      const duration = dur.hour() * 60 + dur.minute();

                      setValue(
                        `activities.${row.index}.endTime`,
                        newValue?.clone()?.add(duration, 'minutes')
                      );
                    }
                  }}
                />
              )}
            />
          );
        },
        size: 160,
        header: 'Início',
      },
      {
        accessorKey: 'durationString',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.duration`}
              defaultValue={{}}
              render={({ field }) => (
                <KeyboardTimePicker
                  ampm={false}
                  fullWidth
                  cancelLabel='Cancelar'
                  invalidDateMessage='Formato inválido'
                  label=''
                  value={field.value}
                  onChange={(newValue) => {
                    setValue(`activities.${row.index}.duration`, newValue);
                    const stTime = values?.[row.index]?.startTime;

                    if (stTime) {
                      const duration =
                        newValue?.hour() * 60 + newValue?.minute();
                      setValue(
                        `activities.${row.index}.endTime`,
                        stTime.clone().add(duration, 'minutes')
                      );
                    }
                  }}
                />
              )}
            />
          );
        },
        header: 'Duração',
        size: 160,
      },
      {
        accessorKey: 'endTimeString',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.endTime`}
              defaultValue={{}}
              render={({ field }) => (
                <KeyboardTimePicker
                  ampm={false}
                  fullWidth
                  disabled
                  cancelLabel='Cancelar'
                  invalidDateMessage='Formato inválido'
                  label=''
                  value={field.value}
                  onChange={(newValue) =>
                    setValue(`activities.${row.index}.endTime`, newValue)
                  }
                />
              )}
            />
          );
        },
        header: 'Fim',
        size: 160,
      },
      {
        accessorKey: 'theme',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.theme`}
              defaultValue={{}}
              render={({ field }) => (
                <TextField
                  type='text'
                  fullWidth
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          );
        },
        header: 'Tema',
        size: 300,
      },
      {
        accessorKey: 'description',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.description`}
              defaultValue={{}}
              render={({ field }) => (
                <TextField
                  type='text'
                  fullWidth
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          );
        },
        header: 'Descrição/Objetivo',
        size: 300,
      },
      {
        accessorKey: 'quantity',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.quantity`}
              defaultValue={{}}
              render={({ field }) => (
                <TextField
                  type='number'
                  fullWidth
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          );
        },
        filterVariant: 'range',
        filterFn: 'between',
        header: 'Quantidade de sessões',
        size: 200,
      },
      {
        accessorKey: 'area.label',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.area`}
              defaultValue={{}}
              render={({ field }) => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={areaOptions}
                  onChange={(event: any, newValue: any) =>
                    setValue(`activities.${row.index}.area`, newValue)
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
        header: 'Área acadêmica',
        size: 270,
      },
      {
        accessorKey: 'course.label',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.course`}
              defaultValue={{}}
              render={({ field }) => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={courseOptions}
                  onChange={(event: any, newValue: any) =>
                    setValue(`activities.${row.index}.course`, newValue)
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
        header: 'Curso',
        size: 270,
      },
      {
        accessorKey: 'spacesString',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.spaces`}
              defaultValue={{}}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={spaces}
                  onChange={(event: any, newValue: any) =>
                    setValue(`activities.${row.index}.spaces`, newValue)
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                        checkedIcon={<CheckBoxIcon fontSize='small' />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.label}
                    </React.Fragment>
                  )}
                  value={field?.value}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label='' />
                  )}
                />
              )}
            />
          );
        },
        enableColumnFilter: false,
        header: 'Espaço',
        size: 270,
      },
      {
        accessorKey: 'temperature.label',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`activities.${row.index}.temperature`}
              defaultValue={{}}
              render={({ field }) => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={temperatureOptions}
                  onChange={(event: any, newValue: any) =>
                    setValue(`activities.${row.index}.temperature`, newValue)
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
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default TableActivity;
