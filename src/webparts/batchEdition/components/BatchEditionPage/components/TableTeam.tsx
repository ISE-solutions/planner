import * as React from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
} from '@material-ui/core';
import ContentEditable from 'react-contenteditable';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import {
  TableEnvolvedPeople,
  TableFantasyName,
  TableParticipants,
} from '../utils';

const TableTeam = ({
  control,
  team,
  setValue,
  modalityOptions,
  temperatureOptions,
  functionOptions,
  persons,
  useOptions,
  useParticipantsOptions,
}) => {
  const [open, setOpen] = React.useState(true);

  return (
    <Box overflow='auto'>
      <Table aria-label='collapsible table' size='small'>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Título</TableCell>
            <TableCell>Sigla</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Código da turma (Financeiro)</TableCell>
            <TableCell>Nome da turma (Financeiro)</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Link backup</TableCell>
            <TableCell>Ano de Conclusão</TableCell>
            <TableCell>Temperatura/Status</TableCell>
            <TableCell>Modalidade</TableCell>
            <TableCell>Permitir atividades concorrentes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {team?.map((row, i) => (
            <>
              <TableRow>
                <TableCell>
                  <IconButton
                    aria-label='expand row'
                    size='small'
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '150px' }}
                >
                  <Controller
                    control={control}
                    name={`team.${i}.title`}
                    render={({ field }) => (
                      <ContentEditable
                        html={(field.value && field.value.toString()) || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '150px' }}
                >
                  <Controller
                    control={control}
                    name={`team.${i}.sigla`}
                    render={({ field }) => (
                      <ContentEditable
                        html={(field.value && field.value.toString()) || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '250px' }}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '200px' }}
                >
                  <Controller
                    control={control}
                    name={`team.${i}.teamCode`}
                    render={({ field }) => (
                      <ContentEditable
                        html={(field.value && field.value.toString()) || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '250px' }}
                >
                  <Controller
                    control={control}
                    name={`team.${i}.teamName`}
                    render={({ field }) => (
                      <ContentEditable
                        html={(field.value && field.value.toString()) || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '250px' }}
                >
                  <Controller
                    control={control}
                    name={`team.${i}.mask`}
                    render={({ field }) => (
                      <ContentEditable
                        html={(field.value && field.value.toString()) || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '250px' }}
                >
                  <Controller
                    control={control}
                    name={`team.${i}.maskBackup`}
                    render={({ field }) => (
                      <ContentEditable
                        html={(field.value && field.value.toString()) || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '100px' }}
                >
                  <Controller
                    control={control}
                    name={`team.${i}.yearConclusion`}
                    render={({ field }) => (
                      <ContentEditable
                        html={(field.value && field.value.toString()) || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '250px' }}
                >
                  <Controller
                    control={control}
                    name={`team.${i}.temperature`}
                    defaultValue={{}}
                    render={({ field }) => (
                      <Autocomplete
                        noOptionsText='Sem Opções'
                        filterSelectedOptions={true}
                        options={temperatureOptions}
                        onChange={(event: any, newValue: any) =>
                          setValue(`team.${i}.temperature`, newValue)
                        }
                        getOptionSelected={(option, value) =>
                          option?.value === value?.value
                        }
                        getOptionLabel={(option) => option?.label || ''}
                        value={field?.value}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            name='temperature'
                            label=''
                          />
                        )}
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '250px' }}
                >
                  <Controller
                    control={control}
                    name={`team.${i}.modality`}
                    defaultValue={{}}
                    render={({ field }) => (
                      <Autocomplete
                        noOptionsText='Sem Opções'
                        filterSelectedOptions={true}
                        options={modalityOptions}
                        onChange={(event: any, newValue: any) =>
                          setValue(`team.${i}.modality`, newValue)
                        }
                        getOptionSelected={(option, value) =>
                          option?.value === value?.value
                        }
                        getOptionLabel={(option) => option?.label || ''}
                        value={field?.value}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            name='modality'
                            label=''
                          />
                        )}
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{ minWidth: '100px' }}
                >
                  <Controller
                    control={control}
                    name={`team.${i}.concurrentActivity`}
                    render={({ field }) => (
                      <Checkbox
                        color='primary'
                        checked={field.value}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={12}
                >
                  <Collapse in={open} timeout='auto' unmountOnExit>
                    <Box
                      display='flex'
                      flexDirection='column'
                      style={{ gap: '1rem' }}
                    >
                      <Box
                        display='flex'
                        flexDirection='column'
                        borderRadius='10px'
                        border='1px solid #0063a5'
                        padding='10px'
                        marginTop='1rem'
                        style={{ gap: '1rem' }}
                      >
                        <TableEnvolvedPeople
                          envolvedPeople={row?.people}
                          functionOptions={functionOptions}
                          persons={persons}
                          baseKey={`team.${i}.people`}
                          control={control}
                          setValue={setValue}
                        />

                        <TableFantasyName
                          fantasyName={row?.names}
                          useOptions={useOptions}
                          baseKey={`team.${i}.names`}
                          control={control}
                          setValue={setValue}
                        />

                        <TableParticipants
                          participants={row?.participants}
                          useOptions={useParticipantsOptions}
                          baseKey={`team.${i}.participants`}
                          control={control}
                          setValue={setValue}
                        />
                      </Box>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TableTeam;
