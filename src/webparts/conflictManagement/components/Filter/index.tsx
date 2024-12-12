import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import * as _ from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import * as React from 'react';
import { IconHelpTooltip } from '~/components';
import { PREFIX } from '~/config/database';
import { DateCalendarStyled, Title, WrapperDatePicker } from './styles';
import { EFatherTag } from '~/config/enums';
import { Datepicker } from '@mobiscroll/react';
import * as moment from 'moment';
import { Replay } from '@material-ui/icons';
import { AVAILABILITY } from '../constants';

interface IFilterProps {
  persons: any[];
  spaces: any[];
  tags: any[];
  values: any;
  errors: any;
  loading: boolean;
  setFieldValue: any;
  handleFilter: any;
}

const Filter: React.FC<IFilterProps> = ({
  values,
  persons,
  spaces,
  tags,
  errors,
  loading,
  setFieldValue,
  handleFilter,
}) => {
  const [resourceSelected, setResourceSelected] = React.useState([]);

  const dataOptions = () => {
    switch (values.typeResource) {
      case 'Pessoa':
        return persons;
      case 'Espaço':
        return spaces;
      default:
        return [];
    }
  };

  const handleAddFilter = () => {
    if (!Object.keys(resourceSelected).length) {
      return;
    }

    switch (values.typeResource) {
      case 'Pessoa':
        if (
          values?.people?.some(
            (pe) =>
              pe?.[`${PREFIX}pessoaid`] ===
              resourceSelected?.[`${PREFIX}pessoaid`]
          )
        ) {
          setResourceSelected([]);
          return;
        }
        const newPeople = [...values.people];
        newPeople.push(resourceSelected);

        setFieldValue('people', newPeople);
        break;
      case 'Espaço':
        if (
          values?.spaces?.some(
            (pe) =>
              pe?.[`${PREFIX}espacoid`] ===
              resourceSelected?.[`${PREFIX}espacoid`]
          )
        ) {
          setResourceSelected([]);
          return;
        }
        const newSpace = _.cloneDeep(values.spaces);
        newSpace.push(resourceSelected);

        setFieldValue('spaces', newSpace);
        break;
    }

    setResourceSelected([]);
  };

  const handleRemove = (item: any) => {
    switch (values.typeResource) {
      case 'Pessoa':
        const newPeople = values.people?.filter((e) => e.id !== item.id);
        setFieldValue('people', newPeople);
        break;
      case 'Espaço':
        const newSpace = values.spaces?.filter((e) => e.id !== item.id);
        setFieldValue('spaces', newSpace);
        break;
    }
  };

  const handleChangeTypeResource = (event) => {
    setFieldValue('typeResource', event.target.value as string);
    setFieldValue('people', []);
    setFieldValue('spaces', []);
    setFieldValue('tagsFilter', []);
    setResourceSelected([]);
  };

  const handleChangeDate = (ev) => {
    const value = ev.value;

    setFieldValue('startDate', moment(value[0]).utc());
    setFieldValue('endDate', moment(value[1]).utc());
  };

  const handleChangeDatePicker = (newValue) => {
    setFieldValue('startDate', newValue);
    setFieldValue('endDate', newValue);
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
    <Box
      display='flex'
      maxHeight='81vh'
      overflow='auto'
      paddingRight='10px'
      flexDirection='column'
      style={{ gap: '1rem' }}
    >
      <Box display='flex' justifyContent='space-between'>
        <Title>Filtro</Title>
        <Tooltip title='Atualizar'>
          <IconButton onClick={handleFilter}>
            <Replay />
          </IconButton>
        </Tooltip>
      </Box>

      <WrapperDatePicker display='flex' flexDirection='column'>
        <Typography>Período</Typography>
        <Datepicker
          touchUi
          pages={2}
          maxRange={60}
          firstDay={0}
          theme='ios'
          value={[values.startDate, values.endDate]}
          onChange={handleChangeDate}
          returnFormat='moment'
          themeVariant='light'
          labelStyle='inline'
          inputStyle='outline'
          controls={['calendar']}
          select='range'
          display='anchored'
          placeholder='Período'
        />
      </WrapperDatePicker>

      <Box>
        <DateCalendarStyled
          value={values.startDate}
          onChange={(value) => handleChangeDatePicker(value)}
        />
        {/* <Datepicker
          controls={['calendar']}
          display='inline'
          firstDay={0}
          onInit={() => null}
          onDestroy={() => null}
          onTempChange={() => null}
          onActiveChange={() => null}
          onActiveDateChange={() => null}
          onClose={() => null}
          defaultValue={values.start}
          defaultSelection={values.start}
          value={values.start}
          onChange={(args) => handleChangeDatePicker(args.value)}
          touchUi={true}
        /> */}
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        padding='10px'
        borderRadius='10px'
        border='1px solid #0063a5'
        style={{ gap: '1rem' }}
      >
        <FormControl component='fieldset'>
          <FormLabel component='legend'>Recurso</FormLabel>
          <RadioGroup
            aria-label='resource'
            name='resource'
            value={values.typeResource}
            onChange={handleChangeTypeResource}
          >
            <FormControlLabel
              value='Pessoa'
              control={<Radio />}
              label='Pessoa'
            />
            <FormControlLabel
              value='Espaço'
              control={<Radio />}
              label='Espaço'
            />
          </RadioGroup>
        </FormControl>

        <FormControl component='fieldset'>
          <FormLabel component='legend'>Disponibilidade</FormLabel>
          <RadioGroup
            aria-label='availability'
            name='availability'
            value={values.availability}
            onChange={(ev) => setFieldValue('availability', ev.target.value)}
          >
            <FormControlLabel value='' control={<Radio />} label='Todos' />
            <FormControlLabel
              value={AVAILABILITY.CONFLITO}
              control={<Radio />}
              label='Apenas conflito'
            />
            <FormControlLabel
              value={AVAILABILITY.PARCIALMENTE_LIVRE}
              control={<Radio />}
              label='Parcialmente livre'
            />
            <FormControlLabel
              value={AVAILABILITY.TOTALMENTE_LIVRE}
              control={<Radio />}
              label='Totalmente livre'
            />
          </RadioGroup>
        </FormControl>

        {/* <FormControlLabel
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
        /> */}

        <Autocomplete
          fullWidth
          multiple
          options={
            (values.typeResource === 'Pessoa'
              ? peopleFilterOptions
              : spaceFilterOptions) || []
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
          getOptionLabel={(option) => option?.label || ''}
          onChange={(event: any, newValue: any | null) =>
            setResourceSelected(newValue)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={
                <Box display='flex' alignItems='center' style={{ gap: '5px' }}>
                  {values.typeResource}
                  <IconHelpTooltip title='Digite pelo menos 3 caracteres para realizar a busca.' />
                </Box>
              }
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
        {[...(values.people || []), ...(values.spaces || [])].map((item) => (
          <Chip label={item.title} onDelete={() => handleRemove(item)} />
        ))}
      </Box>
    </Box>
  );
};

export default Filter;
