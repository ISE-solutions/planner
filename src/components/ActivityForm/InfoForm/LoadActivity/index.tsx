import * as React from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, TYPE_ACTIVITY } from '~/config/enums';
import { getActivities } from '~/store/modules/activity/actions';
import { Autocomplete } from '@material-ui/lab';
import { useConfirmation } from '~/hooks';

interface ILoadActivity {
  open: boolean;
  currentActivity: any;
  onLoadActivity: (activity: any) => void;
  onClose: () => void;
}

const LoadActivity: React.FC<ILoadActivity> = ({
  open,
  currentActivity,
  onClose,
  onLoadActivity,
}) => {
  const [optionChip, setOptionChip] = React.useState(TYPE_ACTIVITY.ACADEMICA);
  const [loading, setLoading] = React.useState(false);
  const [activities, setActivities] = React.useState<any[]>([]);
  const [activitySelected, setActivitySelected] = React.useState({});

  const { confirmation } = useConfirmation();

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

  const handleNext = () => {
    if (
      currentActivity?.[`${PREFIX}tipo`] !== activitySelected?.[`${PREFIX}tipo`]
    ) {
      confirmation.openConfirmation({
        onConfirm: () => {
          onLoadActivity(activitySelected);
          handleClose();
        },
        title: 'Confirmação',
        description:
          'Você está alterando o tipo de atividade, tem certeza de realizar essa ação',
      });
    } else {
      onLoadActivity(activitySelected);
      handleClose();
    }
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
              <TextField
                {...params}
                fullWidth
                label='Atividade'
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color='inherit' size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />

          <Box
            display='flex'
            width='100%'
            marginTop='2rem'
            padding='0 4rem'
            justifyContent='center'
          >
            <Button
              fullWidth
              onClick={handleNext}
              variant='contained'
              color='primary'
            >
              Avançar
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoadActivity;
