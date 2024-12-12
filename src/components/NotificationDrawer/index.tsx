import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  Tooltip,
} from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { PREFIX } from '~/config/database';
import {
  fetchAllNotification,
  readAllNotification,
  readNotification,
} from '~/store/modules/notification/actions';
import { useLoggedUser, useNotification } from '~/hooks';
import { truncateString } from '~/store/modules/notification/utils';
import {
  ListDrawer,
  TextNotification,
  StyledListItem,
  StyledCard,
  StyledTitle,
} from './styles';
import TimeAgo from 'javascript-time-ago';
import pt from 'javascript-time-ago/locale/pt';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {
  Close,
  NotificationsNone,
  Refresh,
  Visibility,
} from '@material-ui/icons';

TimeAgo.addDefaultLocale(pt);
const timeAgo = new TimeAgo('en-US');

interface NotificationDrawerProps {
  open: boolean;
  onOpen: () => void;
  closeDrawer: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  onOpen,
  open,
  closeDrawer,
}) => {
  const { currentUser } = useLoggedUser();
  const [loading, setLoading] = React.useState(false);
  const { notification } = useNotification();
  const dispatch = useDispatch();

  const handleReadAllNotifications = () => {
    setLoading(true);
    readAllNotification(
      notifications?.map((e) => e?.[`${PREFIX}notificacaoid`]),
      {
        onSuccess: (sch) => {
          setLoading(false);
          notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
          });
          handleUpdateNotifications();
        },
        onError: (err) => {
          console.error(err);
          setLoading(false);
        },
      }
    );
  };

  const handleReadNotification = (id) => {
    setLoading(true);
    readNotification(id, {
      onSuccess: (sch) => {
        setLoading(false);
        notification.success({
          title: 'Sucesso',
          description: 'Atualização realizada com sucesso',
        });
        dispatch(
          fetchAllNotification({
            pessoaId: currentUser?.[`${PREFIX}pessoaid`],
          })
        );
      },
      onError: (err) => {
        setLoading(false);
        notification.error({
          title: 'Falha',
          description: err?.data?.error?.message,
        });
      },
    });
  };

  const { notifications } = useSelector(
    (state: AppState) => state.notification
  );

  const handleUpdateNotifications = () => {
    dispatch(
      fetchAllNotification({ pessoaId: currentUser?.[`${PREFIX}pessoaid`] })
    );
  };

  const list = () => (
    <Box
      display='flex'
      alignItems='flex-start'
      flexDirection='column'
      style={{ gap: '1rem' }}
    >
      <Button
        variant='contained'
        color='primary'
        startIcon={<CheckCircleIcon />}
        onClick={() => handleReadAllNotifications()}
      >
        Marcar todos como lido
      </Button>

      <Divider />

      <List>
        <ListItem alignItems={'flex-start'}>
          <ListDrawer>
            {notifications.map((n): any => {
              return (
                <>
                  <Grid justifyContent='space-evenly' direction='row' container>
                    <Grid
                      item
                      xs={11}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        handleReadNotification(n?.[`${PREFIX}notificacaoid`]);
                        n?.[`${PREFIX}link`]
                          ? window.open(n?.[`${PREFIX}link`], '_blank').focus()
                          : null;
                      }}
                    >
                      <TextNotification>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { width: '300px' },
                          }}
                          primary={n?.[`${PREFIX}titulo`]}
                          secondary={
                            <Tooltip title={n?.[`${PREFIX}descricao`] || ''}>
                              <span>
                                {truncateString(n?.[`${PREFIX}descricao`], 50)}
                              </span>
                            </Tooltip>
                          }
                        />
                        <ListItemText
                          primaryTypographyProps={{
                            style: { width: '300px' },
                          }}
                          primary={timeAgo.format(new Date(n.createdon))}
                        />
                      </TextNotification>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        onClick={() =>
                          handleReadNotification(n?.[`${PREFIX}notificacaoid`])
                        }
                      >
                        <Visibility />
                      </IconButton>
                    </Grid>
                  </Grid>
                </>
              );
            })}
          </ListDrawer>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <SwipeableDrawer
        anchor={'right'}
        open={open}
        onClose={() => {}}
        onOpen={() => {}}
      >
        <IconButton
          aria-label='close'
          onClick={closeDrawer}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
        <Box width='25rem' padding='1rem'>
          {notifications.length != 0 && list()}
          {notifications.length == 0 && (
            <>
              <StyledListItem
                style={{ width: '100%', height: '100%' }}
                className='list'
                role='presentation'
                onKeyDown={() => closeDrawer()}
              >
                <StyledCard variant='outlined'>
                  <NotificationsNone fontSize='large' />
                  <StyledTitle color='textSecondary' gutterBottom>
                    Você não possui notificação.
                  </StyledTitle>
                  <Button
                    fullWidth
                    onClick={handleUpdateNotifications}
                    startIcon={<Refresh />}
                    size='medium'
                    variant='contained'
                    color='primary'
                  >
                    Atualizar
                  </Button>
                </StyledCard>
              </StyledListItem>
            </>
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
};
