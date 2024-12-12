import * as React from 'react';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import { TitleSubtable } from './styles';
import { Autocomplete } from '@material-ui/lab';
import ContentEditable from 'react-contenteditable';
import { Controller } from 'react-hook-form';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { EDeliveryType, EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

export const TableEnvolvedPeople = ({
  envolvedPeople,
  functionOptions,
  persons,
  baseKey,
  setValue,
  control,
}) => {
  return (
    <Box margin={1}>
      <TitleSubtable gutterBottom variant='h6'>
        Pessoas Envolvidas
      </TitleSubtable>

      <Table size='small' aria-label='purchases'>
        <TableHead>
          <TableRow>
            <TableCell>Função</TableCell>
            <TableCell>Pessoa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {envolvedPeople?.map((env, i) => (
            <TableRow key={env.id}>
              <TableCell style={{ width: '50%' }} component='th' scope='row'>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.function`}
                  defaultValue={{}}
                  render={({ field }) => (
                    <Autocomplete
                      noOptionsText='Sem Opções'
                      filterSelectedOptions={true}
                      options={functionOptions}
                      onChange={(event: any, newValue: any) =>
                        setValue(`${baseKey}.${i}.function`, newValue)
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
                          name='function'
                          label=''
                        />
                      )}
                    />
                  )}
                />
              </TableCell>
              <TableCell style={{ width: '50%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.person`}
                  defaultValue={{}}
                  render={({ field }) => (
                    <Autocomplete
                      noOptionsText='Sem Opções'
                      filterSelectedOptions={true}
                      options={persons}
                      onChange={(event: any, newValue: any) =>
                        setValue(`${baseKey}.${i}.person`, newValue)
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
                          name='function'
                          label=''
                        />
                      )}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export const TableFantasyName = ({
  fantasyName,
  baseKey,
  setValue,
  control,
  useOptions,
}) => {
  return (
    <Box margin={1}>
      <TitleSubtable gutterBottom variant='h6'>
        Nome Fantasia
      </TitleSubtable>
      <Table size='small' aria-label='purchases'>
        <TableHead>
          <TableRow>
            <TableCell>Nome (PT)</TableCell>
            <TableCell>Nome (EN)</TableCell>
            <TableCell>Nome (ES)</TableCell>
            <TableCell>Uso</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fantasyName?.map((na, i) => (
            <TableRow key={na?.id}>
              <TableCell style={{ width: '25%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.name`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
              <TableCell style={{ width: '25%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.nameEn`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
              <TableCell style={{ width: '25%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.nameEs`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
              <TableCell style={{ width: '25%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.use`}
                  render={({ field }) => (
                    <Autocomplete
                      noOptionsText='Sem Opções'
                      filterSelectedOptions={true}
                      options={useOptions}
                      onChange={(event: any, newValue: any) =>
                        setValue(`${baseKey}.${i}.use`, newValue)
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export const TableClassroom = ({ baseKey, control }) => {
  return (
    <Box margin={1}>
      <TitleSubtable gutterBottom variant='h6'>
        Aula
      </TitleSubtable>
      <Table size='small' aria-label='purchases'>
        <TableHead>
          <TableRow>
            <TableCell>Tema</TableCell>
            <TableCell>Descrição/Objetivo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{ width: '50%' }}>
              <Controller
                control={control}
                name={`${baseKey}.theme`}
                render={({ field }) => (
                  <ContentEditable
                    html={(field.value && field.value.toString()) || ''}
                    onChange={field.onChange}
                  />
                )}
              />
            </TableCell>
            <TableCell style={{ width: '50%' }}>
              <Controller
                control={control}
                name={`${baseKey}.description`}
                render={({ field }) => (
                  <ContentEditable
                    html={(field.value && field.value.toString()) || ''}
                    onChange={field.onChange}
                  />
                )}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export const TableDocuments = ({ documents, baseKey, setValue, control }) => {
  return (
    <Box margin={1}>
      <TitleSubtable gutterBottom variant='h6'>
        Documentos
      </TitleSubtable>
      <Table size='small' aria-label='purchases'>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Fonte</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Momento Entrega</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents?.map((na, i) => (
            <TableRow key={na?.id}>
              <TableCell style={{ width: '25%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.name`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
              <TableCell style={{ width: '25%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.font`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
              <TableCell style={{ width: '25%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.link`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
              <TableCell style={{ width: '25%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.delivery`}
                  render={({ field }) => (
                    <Autocomplete
                      noOptionsText='Sem Opções'
                      options={Object.keys(EDeliveryType)}
                      onChange={(event: any, newValue: any) =>
                        setValue(`${baseKey}.${i}.delivery`, newValue)
                      }
                      getOptionLabel={(option) => EDeliveryType[option]}
                      value={field?.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          name='delivery'
                          label=''
                        />
                      )}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export const TableRequestAcademic = ({
  academicRequests,
  baseKey,
  setValue,
  control,
}) => {
  const { tag, person, finiteInfiniteResource } = useSelector(
    (state: AppState) => state
  );
  const { tags } = tag;
  const { persons } = person;
  const { finiteInfiniteResources } = finiteInfiniteResource;

  const equipmentsOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.EQUIPAMENTO_OUTROS
        )
      ),
    [tags]
  );

  const finiteResources = React.useMemo(
    () =>
      finiteInfiniteResources?.filter(
        (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
      ),
    [finiteInfiniteResources]
  );

  const infiniteResources = React.useMemo(
    () =>
      finiteInfiniteResources?.filter(
        (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
      ),
    [finiteInfiniteResources]
  );

  return (
    <Box margin={1}>
      <TitleSubtable gutterBottom variant='h6'>
        Requisição acadêmica
      </TitleSubtable>
      <Table size='small' aria-label='purchases'>
        <TableHead>
          <TableRow>
            <TableCell>Descrição</TableCell>
            <TableCell>Momento Entrega</TableCell>
            <TableCell>Data de Entrega</TableCell>
            <TableCell>Prazo de Entrega</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Equipamentos</TableCell>
            <TableCell>Recursos Finitos</TableCell>
            <TableCell>Recursos Infinitos</TableCell>
            <TableCell>Outros</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {academicRequests?.map((na, i) => (
            <TableRow key={na?.id}>
              <TableCell>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.description`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.delivery`}
                  render={({ field }) => (
                    <Autocomplete
                      noOptionsText='Sem Opções'
                      options={Object.keys(EDeliveryType)}
                      onChange={(event: any, newValue: any) =>
                        setValue(`${baseKey}.${i}.delivery`, newValue)
                      }
                      getOptionLabel={(option) => EDeliveryType[option]}
                      value={field?.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          name='delivery'
                          label=''
                        />
                      )}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.deliveryDate`}
                  render={({ field }) => (
                    <KeyboardDatePicker
                      clearable
                      autoOk
                      fullWidth
                      variant='inline'
                      format='DD/MM/YYYY'
                      label=''
                      value={field.value}
                      onChange={(newValue) =>
                        setValue(`${baseKey}.${i}.deliveryDate`, newValue)
                      }
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.deadline`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.link`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.equipments`}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      noOptionsText='Sem Opções'
                      filterSelectedOptions={true}
                      options={equipmentsOptions}
                      onChange={(event: any, newValue: any[]) =>
                        setValue(`${baseKey}.${i}.equipments`, newValue)
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
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.finiteResource`}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      noOptionsText='Sem Opções'
                      filterSelectedOptions={true}
                      options={finiteResources}
                      onChange={(event: any, newValue: any[]) =>
                        setValue(`${baseKey}.${i}.finiteResource`, newValue)
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
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.infiniteResource`}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      noOptionsText='Sem Opções'
                      filterSelectedOptions={true}
                      options={infiniteResources}
                      onChange={(event: any, newValue: any[]) =>
                        setValue(`${baseKey}.${i}.infiniteResource`, newValue)
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
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.other`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export const TableParticipants = ({
  participants,
  baseKey,
  setValue,
  control,
  useOptions,
}) => {
  return (
    <Box margin={1}>
      <TitleSubtable gutterBottom variant='h6'>
        Participantes
      </TitleSubtable>
      <Table size='small' aria-label='purchases'>
        <TableHead>
          <TableRow>
            <TableCell>Data Limite de Preenchimento</TableCell>
            <TableCell>Quantidade Prevista</TableCell>
            <TableCell>Uso</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {participants?.map((na, i) => (
            <TableRow key={na?.id}>
              <TableCell style={{ width: '33%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.date`}
                  render={({ field }) => (
                    <KeyboardDatePicker
                      clearable
                      autoOk
                      fullWidth
                      variant='inline'
                      format='DD/MM/YYYY'
                      label=''
                      value={field.value}
                      onChange={(newValue) =>
                        setValue(`${baseKey}.${i}.date`, newValue)
                      }
                    />
                  )}
                />
              </TableCell>
              <TableCell style={{ width: '33%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.quantity`}
                  render={({ field }) => (
                    <ContentEditable
                      html={(field.value && field.value.toString()) || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </TableCell>
              <TableCell style={{ width: '33%' }}>
                <Controller
                  control={control}
                  name={`${baseKey}.${i}.use`}
                  render={({ field }) => (
                    <Autocomplete
                      noOptionsText='Sem Opções'
                      filterSelectedOptions={true}
                      options={useOptions}
                      onChange={(event: any, newValue: any) =>
                        setValue(`${baseKey}.${i}.use`, newValue)
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
                          name={`${baseKey}.${i}.use`}
                          label=''
                        />
                      )}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
