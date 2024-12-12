import * as React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { Autocomplete } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import * as moment from 'moment';
import {
  getAcademicRequestsByActivityId,
  updateActivityAll,
} from '~/store/modules/activity/actions';
import * as _ from 'lodash';
import formatActivityModel from '~/utils/formatActivityModel';
import momentToMinutes from '~/utils/momentToMinutes';

interface ICloneActivity {
  open: boolean;
  activity: any;
  refetchActivity: any;
  schedules: any[];
  onClose: () => void;
}

const CloneActivity: React.FC<ICloneActivity> = ({
  open,
  activity,
  refetchActivity,
  schedules,
  onClose,
}) => {
  const [itemSelected, setItemSelected] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [academicRequests, setAcademicRequests] = React.useState([]);

  const dispatch = useDispatch();

  const { tag, space, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictSpace } = space;
  const { dictPeople } = person;

  React.useEffect(() => {
    if (activity) {
      getAcademicRequestsByActivityId(activity?.[`${PREFIX}atividadeid`]).then(
        (data) => setAcademicRequests(data)
      );
    }
  }, [activity]);

  const handleClose = () => {
    setItemSelected(null);
    onClose();
  };

  const handleSave = () => {
    setLoading(true);

    let activityToSave = _.cloneDeep(activity);
    const lastActivity =
      itemSelected?.activities?.[itemSelected?.activities?.length - 1];

    const hasActivities = itemSelected?.activities?.length

    const durationMoment = moment(activityToSave?.[`${PREFIX}duracao`], 'HH:mm');
    const duration = momentToMinutes(durationMoment);
    const endTime = moment(lastActivity?.[`${PREFIX}fim`], 'HH:mm')
      .add(duration, 'm')
      .format('HH:mm');

    activityToSave = formatActivityModel(
      {
        ...activityToSave,
        [`${PREFIX}inicio`]: hasActivities ? lastActivity?.[`${PREFIX}fim`] : activityToSave[`${PREFIX}inicio`],
        [`${PREFIX}duracao`]: activityToSave?.[`${PREFIX}duracao`],
        [`${PREFIX}fim`]: hasActivities ? endTime : activityToSave[`${PREFIX}inicio`],
        programId: activity?.[`_${PREFIX}programa_value`],
        teamId: activity?.[`_${PREFIX}turma_value`],
        [`${PREFIX}RequisicaoAcademica_Atividade`]: academicRequests,
      },
      moment.utc(itemSelected?.[`${PREFIX}data`]),
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
          scheduleId: itemSelected?.[`${PREFIX}cronogramadediaid`],
        },
        {
          onSuccess: () => {
            refetchActivity();
            setLoading(false);
            handleClose();
          },
          onError: (err) => {
            setLoading(false);
          },
        }
      )
    );
  };

  const scheduleOptions = React.useMemo(
    () =>
      schedules?.sort((a, b) =>
        moment.utc(a?.[`${PREFIX}data`]).diff(moment.utc(b?.[`${PREFIX}data`]))
      ),
    [schedules]
  );

  return (
    <Dialog open={open} fullWidth maxWidth='sm'>
      <DialogTitle>
        Para qual dia a atividade será clonada?
        <IconButton
          aria-label='close'
          onClick={handleClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
          <Autocomplete
            fullWidth
            options={scheduleOptions}
            noOptionsText={'Sem opções'}
            value={itemSelected}
            getOptionLabel={(option) =>
              moment.utc(option?.[`${PREFIX}data`]).format('DD/MM/YYYY') || ''
            }
            onChange={(event: any, newValue: any | null) =>
              setItemSelected(newValue)
            }
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Dia de aula' />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancelar
        </Button>

        <Button onClick={handleSave} variant='contained' color='primary'>
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

export default CloneActivity;
