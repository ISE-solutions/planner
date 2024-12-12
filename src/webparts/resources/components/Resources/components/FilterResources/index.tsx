import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import * as _ from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import * as React from 'react';
import { IconHelpTooltip } from '~/components';
import { TOP_QUANTITY } from '~/config/constants';
import { PREFIX } from '~/config/database';
import { useFiniteInfiniteResource } from '~/hooks';
import { Title } from './styles';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import { EFatherTag } from '~/config/enums';

interface IFilterResourcesProps {
  values: any;
  errors: any;
  loading: boolean;
  setFieldValue: any;
  handleFilter: any;
}

const FilterResources: React.FC<IFilterResourcesProps> = ({
  values,
  errors,
  loading,
  setFieldValue,
  handleFilter,
}) => {
  const [typeResource, setTypeResource] = React.useState('Pessoa');
  const [resourceSelected, setResourceSelected] = React.useState({});
  const [filterResource, setFilterResource] = React.useState({
    top: TOP_QUANTITY,
    active: 'Ativo' as any,
    searchQuery: '',
  });

  const { space, person, tag } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { spaces } = space;
  const { persons } = person;

  const [
    { loading: loadingFiniteResource, refetch: getFiniteResource, resources },
  ] = useFiniteInfiniteResource(filterResource, {
    manual: true,
  });

  React.useEffect(() => {
    switch (typeResource) {
      case 'Recurso Finito':
        getFiniteResource();
        break;
    }
  }, [filterResource]);

  const dataOptions = () => {
    switch (typeResource) {
      case 'Pessoa':
        return persons;
      case 'Espaço':
        return spaces;
      case 'Recurso Finito':
        return resources;
      default:
        return [];
    }
  };

  const handleAddFilter = () => {
    let newFilter = null;

    if (!Object.keys(resourceSelected).length) {
      return;
    }

    switch (typeResource) {
      case 'Pessoa':
        newFilter = {
          typeResource,
          value: resourceSelected?.[`${PREFIX}pessoaid`],
          label: resourceSelected?.[`${PREFIX}nome`],
        };
        const newPeople = [...values.people];
        newPeople.push(newFilter);

        setFieldValue('people', newPeople);
        break;
      case 'Espaço':
        newFilter = {
          typeResource,
          value: resourceSelected?.[`${PREFIX}espacoid`],
          label: resourceSelected?.[`${PREFIX}nome`],
        };
        const newSpace = _.cloneDeep(values.spaces);
        newSpace.push(newFilter);

        setFieldValue('spaces', newSpace);
        break;
      case 'Recurso Finito':
        newFilter = {
          typeResource,
          value: resourceSelected?.[`${PREFIX}pessoaid`],
          label: resourceSelected?.[`${PREFIX}nome`],
        };
        break;
      case 'Recurso Ininito':
        newFilter = {
          typeResource,
          value: resourceSelected?.[`${PREFIX}pessoaid`],
          label: resourceSelected?.[`${PREFIX}nome`],
        };
        break;
    }

    setResourceSelected({});
  };

  const handleRemove = (item: any) => {
    switch (item.typeResource) {
      case 'Pessoa':
        const newPeople = values.people?.filter((e) => e.value !== item.value);
        setFieldValue('people', newPeople);
        break;
      case 'Espaço':
        const newSpace = values.spaces?.filter((e) => e.value !== item.value);
        setFieldValue('spaces', newSpace);
        break;
      case 'Recurso Finito':
        const newFiniteResource = values.spaces?.filter(
          (e) => e.value !== item.value
        );
        setFieldValue('spaces', newSpace);
        break;
    }
  };

  const spaceFilterOptions = React.useMemo(
    () =>
      tags.filter(
        (tag) =>
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.TIPO_ESPACO
          )
      ),
    [tags]
  );

  const peopleFilterOptions = React.useMemo(
    () =>
      tags.filter(
        (tag) =>
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
          )
      ),
    [tags]
  );

  return (
    <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
      <Title>Filtro</Title>

      <KeyboardDatePicker
        autoOk
        clearable
        autoFocus
        fullWidth
        format={'MM/YYYY'}
        views={['month', 'year']}
        variant='inline'
        label='Início'
        error={!!errors.startDate}
        helperText={errors.startDate}
        value={values.startDate}
        onChange={(value) => setFieldValue('startDate', value)}
      />

      <KeyboardDatePicker
        autoOk
        clearable
        fullWidth
        format={'MM/YYYY'}
        views={['month', 'year']}
        variant='inline'
        label='Fim'
        error={!!errors.endDate}
        helperText={errors.endDate}
        value={values.endDate}
        onChange={(value) => setFieldValue('endDate', value)}
      />

      <Box
        display='flex'
        flexDirection='column'
        padding='10px'
        borderRadius='10px'
        border='1px solid #0063a5'
        style={{ gap: '1rem' }}
      >
        <FormControl fullWidth>
          <InputLabel id='recurso-label'>Recurso</InputLabel>
          <Select
            fullWidth
            labelId='recurso-label'
            value={typeResource}
            onChange={(event) => {
              setTypeResource(event.target.value as string);
              setFieldValue('tagsFilter', null);
              setResourceSelected(null);
            }}
          >
            <MenuItem value='Pessoa'>Pessoa</MenuItem>
            <MenuItem value='Espaço'>Espaço</MenuItem>
            {/* <MenuItem value='Recurso Finito'>Recurso Finito</MenuItem>
            <MenuItem value='Recurso Ininito'>Recurso Infinito</MenuItem> */}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={values.onlyConflicts}
              onChange={(event) =>
                setFieldValue('onlyConflicts', event.target.checked)
              }
              name='onlyConflicts'
              color='primary'
            />
          }
          label='Apenas conflitos?'
        />

        <Autocomplete
          fullWidth
          // multiple
          options={
            typeResource === 'Pessoa' ? peopleFilterOptions : spaceFilterOptions
          }
          noOptionsText={'Sem opções'}
          value={values.tagsFilter}
          getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
          onChange={(event: any, newValue: any[] | null) =>
            setFieldValue('tagsFilter', newValue)
          }
          renderInput={(params) => (
            <TextField {...params} fullWidth label='Etiqueta' />
          )}
        />

        <Autocomplete
          fullWidth
          options={dataOptions() || []}
          noOptionsText={'Sem opções'}
          value={resourceSelected}
          getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
          onChange={(event: any, newValue: any | null) =>
            setResourceSelected(newValue)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={
                <Box display='flex' alignItems='center' style={{ gap: '5px' }}>
                  {typeResource}
                  <IconHelpTooltip title='Digite pelo menos 3 caracteres para realizar a busca.' />
                </Box>
              }
              onChange={(event) =>
                setFilterResource({
                  ...filterResource,
                  searchQuery: event.target.value,
                })
              }
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingFiniteResource ? (
                      <CircularProgress color='inherit' size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        <Button variant='contained' onClick={handleAddFilter} color='secondary'>
          Adicionar
        </Button>
      </Box>

      <Button variant='contained' onClick={handleFilter} color='primary'>
        {loading ? (
          <CircularProgress style={{ color: '#fff' }} size={20} />
        ) : (
          'Filtrar'
        )}
      </Button>
      <Divider />

      <Box display='flex' flexWrap='wrap' style={{ gap: '10px' }}>
        {[...values.people, ...values.spaces].map((item) => (
          <Chip label={item.label} onDelete={() => handleRemove(item)} />
        ))}
      </Box>
    </Box>
  );
};

export default FilterResources;
