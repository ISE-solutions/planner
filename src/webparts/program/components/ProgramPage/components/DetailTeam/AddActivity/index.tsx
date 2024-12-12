import * as React from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, TYPE_ACTIVITY } from '~/config/enums';
import {
  getActivities,
  updateActivityAll,
} from '~/store/modules/activity/actions';
import { Autocomplete } from '@material-ui/lab';
import * as _ from 'lodash';
import formatActivityModel from '~/utils/formatActivityModel';
import * as moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IAddActivity {
  open: boolean;
  schedule: any;
  date: any;
  programId: string;
  teamId: string;
  refetchActivity: any;
  onClose: () => void;
}

const AddActivity: React.FC<IAddActivity> = ({
  open,
  date,
  schedule,
  programId,
  teamId,
  refetchActivity,
  onClose,
}) => {
  const [optionChip, setOptionChip] = React.useState(TYPE_ACTIVITY.ACADEMICA);
  const [loading, setLoading] = React.useState(false);
  const [activities, setActivities] = React.useState<any[]>([]);
  const [activitySelected, setActivitySelected] = React.useState({});

  const dispatch = useDispatch();

  const { tag, space, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictSpace } = space;
  const { dictPeople } = person;

  React.useEffect(() => {
    handleFetchActivities();
  }, []);

  const handleFetchActivities = () => {
    setLoading(true);
    getActivities({
      active: 'Ativo' as any,
      typeApplication: EActivityTypeApplication.PLANEJAMENTO,
    }).then((activityData) => {
      setLoading(false);
      setActivities(activityData);
    });
  };

  const handleClose = () => {
    setActivitySelected({});
    onClose();
  };

  const handleSave = () => {
    if (!activitySelected) {
      return;
    }

    setLoading(true);

    let activityToSave = _.cloneDeep(activitySelected);
    activityToSave = formatActivityModel(
      {
        ...activityToSave,
        [`${PREFIX}inicio`]: date.format('HH:mm'),
        programId,
        teamId,
      },
      moment.utc(date.format('YYYY-MM-DDTHH:mm:ssZ')),
      {
        isModel: false,
        dictPeople: dictPeople,
        dictSpace: dictSpace,
        dictTag: dictTag,
      }
    );

    dispatch(
      updateActivityAll(
        {
          ...activityToSave,
          scheduleId: schedule?.[`${PREFIX}cronogramadediaid`],
        },
        {
          onSuccess: () => {
            refetchActivity();
            setLoading(false);
            setActivitySelected({});
            handleClose();
          },
          onError: (err, actv) => {
            setLoading(false);
            setActivitySelected(actv);
          },
        }
      )
    );
  };

  const options = [
    { value: TYPE_ACTIVITY.ACADEMICA, label: 'Acadêmica' },
    { value: TYPE_ACTIVITY.NON_ACADEMICA, label: 'Não Acadêmica' },
    { value: TYPE_ACTIVITY.INTERNAL, label: 'Interna' },
  ];

  const activityOptions = React.useMemo(
    () => activities.filter((act) => act?.[`${PREFIX}tipo`] === optionChip),
    [activities, optionChip]
  );

  return (
    <Dialog open={open} fullWidth maxWidth='md'>
      <DialogTitle>
        Busca de atividade
        <IconButton
          aria-label='close'
          onClick={handleClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          display='flex'
          flexDirection='column'
          padding='2rem'
          style={{ gap: '1rem' }}
        >
          <Box
            display='flex'
            flexDirection='column'
            borderRadius='10px'
            border='1px solid #0063a5'
            padding='10px'
            style={{ gap: '1rem' }}
          >
            <Box display='flex' alignItems='center' style={{ gap: '1rem' }}>
              <Typography
                variant='body2'
                color='primary'
                style={{ fontWeight: 'bold' }}
              >
                Filtro
              </Typography>
            </Box>

            <Box display='flex' style={{ gap: '10px' }}>
              {options?.map((opt) => (
                <Chip
                  color={opt.value === optionChip ? 'primary' : 'default'}
                  onClick={() => setOptionChip(opt.value)}
                  label={opt.label}
                />
              ))}
            </Box>
          </Box>

          <Autocomplete
            fullWidth
            options={activityOptions || []}
            noOptionsText={'Sem opções'}
            value={activitySelected}
            getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
            onChange={(event: any, newValue: any) =>
              setActivitySelected(newValue)
            }
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Atividade' />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          disabled={!Object.keys(activitySelected).length}
          variant='contained'
          color='primary'
        >
          {loading ? (
            <CircularProgress size={20} style={{ color: '#fff' }} />
          ) : (
            'Salvar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActivity;
