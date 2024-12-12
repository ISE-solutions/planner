import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { EDeliveryType } from '~/config/enums';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { KeyboardDatePicker } from '@material-ui/pickers';

const TableActivityRequestAcademic = ({
  values,
  control,
  setValue,
  equipmentsOptions,
  finiteResources,
  infiniteResources,
}) => {
  const handleAcademicRequestChange = (
    field: string,
    value: any,
    id: string,
    keyId: string
  ) => {
    const indexActivity = values.findIndex((sc) => sc.id === id);
    const indexName = values[indexActivity].academicRequests.findIndex(
      (sc) => sc.keyId === keyId
    );

    setValue(
      `activities.${indexActivity}.academicRequests.${indexName}.${field}`,
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
              name={`description`}
              defaultValue={{}}
              render={({ field }) => (
                <TextField
                  type='text'
                  fullWidth
                  value={row.original?.req?.description}
                  onChange={(event) =>
                    handleAcademicRequestChange(
                      'description',
                      event.target.value,
                      row.original.id,
                      row.original.req.keyId
                    )
                  }
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Descrição',
      },
      {
        accessorKey: 'delivery',
        Cell: ({ cell }) => {
          const { row } = cell;

          return (
            <Controller
              control={control}
              name={`req.delivery`}
              defaultValue={''}
              render={({ field }) => (
                <Autocomplete
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={Object.keys(EDeliveryType)}
                  onChange={(event: any, newValue: any) =>
                    handleAcademicRequestChange(
                      'delivery',
                      newValue,
                      row.original.id,
                      row.original.req.keyId
                    )
                  }
                  getOptionLabel={(option) => EDeliveryType[option]}
                  value={row.original.req.delivery}
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
      {
        accessorKey: 'delivery',
        Cell: ({ cell }) => {
          const { row } = cell;

          return (
            <Controller
              control={control}
              name={`req.deliveryDate`}
              defaultValue={''}
              render={({ field }) => (
                <KeyboardDatePicker
                  clearable
                  autoOk
                  fullWidth
                  variant='inline'
                  format='DD/MM/YYYY'
                  label=''
                  value={row.original.req.deliveryDate}
                  onChange={(newValue) =>
                    handleAcademicRequestChange(
                      'deliveryDate',
                      newValue,
                      row.original.id,
                      row.original.req.keyId
                    )
                  }
                />
              )}
            />
          );
        },
        size: 300,
        header: 'Data de entrega',
      },
      {
        accessorKey: 'deadline',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`deadline`}
              defaultValue={{}}
              render={() => (
                <TextField
                  type='number'
                  fullWidth
                  value={row.original?.req?.deadline}
                  onChange={(event) =>
                    handleAcademicRequestChange(
                      'deadline',
                      event.target.value,
                      row.original.id,
                      row.original.req.keyId
                    )
                  }
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Prazo entrega',
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
                  type='url'
                  fullWidth
                  value={row.original?.req?.link}
                  onChange={(event) =>
                    handleAcademicRequestChange(
                      'link',
                      event.target.value,
                      row.original.id,
                      row.original.req.keyId
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
        accessorKey: 'equipments',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`equipments`}
              defaultValue={{}}
              render={() => (
                <Autocomplete
                  multiple
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={equipmentsOptions || []}
                  onChange={(event: any, newValue: any[]) =>
                    handleAcademicRequestChange(
                      'equipments',
                      newValue,
                      row.original.id,
                      row.original.req.keyId
                    )
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={row.original?.req?.equipments}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label='' />
                  )}
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Equipamentos',
      },
      {
        accessorKey: 'finiteResource',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`finiteResource`}
              defaultValue={{}}
              render={() => (
                <Autocomplete
                  multiple
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={finiteResources || []}
                  onChange={(event: any, newValue: any[]) =>
                    handleAcademicRequestChange(
                      'finiteResource',
                      newValue,
                      row.original.id,
                      row.original.req.keyId
                    )
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={row.original?.req?.finiteResource}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label='' />
                  )}
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Recursos finito',
      },
      {
        accessorKey: 'infiniteResource',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`infiniteResource`}
              defaultValue={{}}
              render={() => (
                <Autocomplete
                  multiple
                  noOptionsText='Sem Opções'
                  style={{ width: '100%' }}
                  filterSelectedOptions={true}
                  options={infiniteResources || []}
                  onChange={(event: any, newValue: any[]) =>
                    handleAcademicRequestChange(
                      'infiniteResource',
                      newValue,
                      row.original.id,
                      row.original.req.keyId
                    )
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={row.original?.req?.infiniteResource}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label='' />
                  )}
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Recursos infinito',
      },
      {
        accessorKey: 'other',
        Cell: ({ cell }) => {
          const { row } = cell;
          return (
            <Controller
              control={control}
              name={`other`}
              defaultValue={{}}
              render={() => (
                <TextField
                  type='text'
                  fullWidth
                  value={row.original?.req?.other}
                  onChange={(event) =>
                    handleAcademicRequestChange(
                      'other',
                      event.target.value,
                      row.original.id,
                      row.original.req.keyId
                    )
                  }
                />
              )}
            />
          );
        },
        size: 270,
        header: 'Outro',
      },
    ],
    []
  );

  const rows = React.useMemo(() => {
    const result = [];
    values.forEach((act) => {
      act.academicRequests.forEach((req) => {
        result.push({
          ...act,
          req: req,
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

export default TableActivityRequestAcademic;
