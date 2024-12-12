import * as React from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Drawer,
  List,
  CssBaseline,
  Divider,
  ListItem,
  ListItemText,
  Collapse,
  Link,
  ListItemIcon,
  Box,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Typography,
  Badge,
} from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import {
  FaUser,
  FaTag,
  FaInfinity,
  FaPuzzlePiece,
  FaSchool,
  FaAngleLeft,
  FaAngleRight,
  FaAward,
  FaUserFriends,
  FaCubes,
  FaTasks,
  FaTrashRestore,
} from 'react-icons/fa';
import { MdWorkspacesFilled } from 'react-icons/md';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
  ExpandMore,
  ExpandLess,
  EventBusy,
  InsertChart,
  Timer,
  Search,
} from '@material-ui/icons';
import { HiTemplate } from 'react-icons/hi';

import { sp } from '@pnp/sp';
import styles from './Page.module.scss';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useLoggedUser } from '~/hooks';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { NotificationDrawer } from '../NotificationDrawer/index';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllNotification } from '~/store/modules/notification/actions';
import { PREFIX } from '~/config/database';
import { AppState } from '~/store';
import { fetchAllEnvironmentReference } from '~/store/modules/environmentReference/actions';
import { fetchTooltips } from '~/store/modules/app/actions';
import '@react-awesome-query-builder/material/css/styles.css';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { BsCollectionFill } from 'react-icons/bs';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: 'calc(100vh - 3rem)',
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      margin: '0 1rem',
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      left: 'auto',
      position: 'relative',
      overflowY: 'initial',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      left: 'auto',
      position: 'relative',
      overflowY: 'initial',
      width: '69px',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    drawerPaper: {
      width: drawerWidth,
      paddingRight: theme.spacing(2),
      top: 'auto',
      left: 'auto',
    },
    nested: {
      borderRadius: '14px',
    },
  })
);

interface ItemBreadcrumbs {
  name: string;
  page: string;
}
interface IPageProps {
  noPadding?: boolean;
  blockOverflow?: boolean;
  children: React.ReactNode;
  itemsBreadcrumbs?: ItemBreadcrumbs[];
  context: WebPartContext;
  maxHeight?: string | number;
}

const Page: React.FC<IPageProps> = ({
  children,
  blockOverflow = true,
  noPadding,
  context,
  maxHeight,
  itemsBreadcrumbs,
}) => {
  const classes = useStyles();
  const [openDrawerNotifications, setOpenDrawerNotifications] =
    React.useState(false);
  const [openMenu, setOpenMenu] = useState({});
  const [itemsMenu, setItemsMenu] = useState([]);
  const [allMenu, setAllMenu] = useState([]);
  const [open, setOpen] = React.useState(true);
  const { notifications } = useSelector(
    (state: AppState) => state.notification
  );

  const dispatch = useDispatch();

  const { currentUser } = useLoggedUser();
  const _menu = sp.web.lists.getByTitle('Menu');

  React.useEffect(() => {
    if (currentUser) {
      dispatch(fetchTooltips());
      getMenu();
      dispatch(fetchAllEnvironmentReference());
      dispatch(
        fetchAllNotification({ pessoaId: currentUser?.[`${PREFIX}pessoaid`] })
      );
    }
  }, [currentUser]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(
        fetchAllNotification({ pessoaId: currentUser?.[`${PREFIX}pessoaid`] })
      );
    }, 120000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

  const handleOpenMenu = (Id: number) => {
    setOpenMenu({
      ...openMenu,
      [Id]: !openMenu[Id],
    });
  };
  const closeDrawer = () => {
    setOpenDrawerNotifications(false);
  };

  const getMenu = async () => {
    const data = await _menu.items
      .expand('InMenuPai')
      .select('Id, Title, InLink,InOrdem, InMenuPai/Id, InMenuPai/Title')
      .filter(`InAtivo eq 1`)
      .orderBy('InOrdem')
      .usingCaching()
      .get();

    setAllMenu(data);

    const itensChildren = data?.filter((e) => e.InMenuPai?.Id);
    const itensParent = data
      ?.filter((e) => {
        if (e?.Title === 'Planejamento') {
          return currentUser?.isPlanning;
        }

        return !e.InMenuPai?.Id;
      })
      ?.sort((a, b) => a?.InOrdem - b?.InOrdem);

    itensParent.forEach((elm) => {
      elm.submenu = itensChildren
        ?.filter((e) => e.InMenuPai.Id === elm.Id)
        ?.sort((a, b) => a?.InOrdem - b?.InOrdem);
    });

    setItemsMenu(itensParent);
  };

  const handleDrawer = () => {
    setOpen(!open);
  };

  const menuIcon = {
    Programa: <FaAward size='1.3rem' />,
    Planejamento: <HiTemplate size='1.3rem' />,
    // 'Categoria Etiqueta': <MdCategory size='1.2rem' />,
    Etiqueta: <FaTag size='1.2rem' />,
    Espaço: <MdWorkspacesFilled size='1.2rem' />,
    'Recurso Finito': <FaPuzzlePiece size='1.2rem' />,
    Pessoa: <FaUser size='1.2rem' />,
    'Recurso Infinito': <FaInfinity size='1.2rem' />,
    'Atividade Acadêmica': <FaSchool size='1.2rem' />,
    'Atividade Não Acadêmica': <FaSchool size='1.2rem' />,
    'Atividade Interna': <FaSchool size='1.2rem' />,
    Modelos: <FaPuzzlePiece size='1.2rem' />,
    Dia: <IoCalendarNumberSharp size='1.2rem' />,
    Turma: <FaUserFriends size='1.2rem' />,
    Atividade: <FaSchool size='1.2rem' />,
    Tarefa: <FaTasks size='1.2rem' />,
    Recursos: <FaCubes size='1.2rem' />,
    'Gestão de Conflitos': <EventBusy />,
    Relatórios: <InsertChart />,
    Horário: <Timer />,
    'Consulta Avançada': <Search />,
    Lixeira: <FaTrashRestore size='1.2rem' />,
    Agrupamento: <BsCollectionFill size='1.2rem' />,
  };

  const urlActive = window.location.href;
  const itemActive = React.useMemo(() => {
    const item = allMenu.find((e) => e?.InLink?.Url === urlActive);

    setOpenMenu({
      ...openMenu,
      [item?.InMenuPai?.Id || item?.Id]: true,
    });
    return item;
  }, [urlActive, allMenu]);

  const absoluteUrl = context.pageContext.web.absoluteUrl;

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          variant='permanent'
          id='drawerMenu'
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
          anchor='left'
        >
          <Box position='absolute' right='-.9rem' top='1.3rem' zIndex={9999}>
            <IconButton onClick={handleDrawer} className={styles.iconClose}>
              {open ? (
                <FaAngleLeft color='#0063a5' />
              ) : (
                <FaAngleRight color='#0063a5' />
              )}
            </IconButton>
          </Box>
          <Divider />
          <Box
            display='flex'
            justifyContent='space-between'
            flexDirection='column'
            minHeight='calc(100vh - 3rem)'
          >
            <List className={styles.wrapperMenu}>
              {itemsMenu.map(({ Id, Title, icon, InLink, submenu }) => (
                <>
                  {submenu && submenu.length ? (
                    <>
                      <ListItem
                        button
                        key={Title}
                        onClick={() => handleOpenMenu(Id)}
                        className={`${
                          itemActive?.Id === Id && styles.activeMenu
                        } ${classes.nested}`}
                      >
                        <Tooltip arrow title={Title}>
                          <ListItemIcon>{menuIcon[Title]}</ListItemIcon>
                        </Tooltip>
                        {open && (
                          <>
                            <ListItemText
                              primary={
                                <span className={styles.titleMenu}>
                                  {Title}
                                </span>
                              }
                            />
                            {openMenu[Id] ? (
                              <ExpandMore fontSize='small' />
                            ) : (
                              <ExpandLess fontSize='small' />
                            )}
                          </>
                        )}
                      </ListItem>

                      <Collapse
                        in={openMenu[Id]}
                        timeout='auto'
                        style={open && { paddingLeft: '1rem' }}
                        unmountOnExit
                      >
                        {submenu.map((sub) => (
                          <List component='div' disablePadding>
                            <Link
                              href={sub?.InLink?.Url}
                              color='inherit'
                              style={{ textDecoration: 'none' }}
                            >
                              <ListItem
                                button
                                className={`${
                                  itemActive?.Id === sub?.Id &&
                                  styles.activeMenu
                                } ${classes.nested}`}
                              >
                                <Tooltip arrow title={sub.Title}>
                                  <ListItemIcon>
                                    {menuIcon[sub.Title]}
                                  </ListItemIcon>
                                </Tooltip>

                                {open && (
                                  <ListItemText
                                    className={styles.itemMenu}
                                    primary={sub.Title}
                                  />
                                )}
                              </ListItem>
                            </Link>
                          </List>
                        ))}
                      </Collapse>
                    </>
                  ) : (
                    <Link
                      href={InLink?.Url}
                      color='inherit'
                      style={{ textDecoration: 'none' }}
                    >
                      <ListItem
                        button
                        className={`${
                          itemActive?.Id === Id && styles.activeMenu
                        } ${classes.nested}`}
                      >
                        <Tooltip arrow title={Title}>
                          <ListItemIcon>{menuIcon[Title]}</ListItemIcon>
                        </Tooltip>
                        {open && <ListItemText primary={Title} />}
                      </ListItem>
                    </Link>
                  )}
                </>
              ))}
            </List>

            <List>
              <ListItem onClick={() => setOpenDrawerNotifications(true)} button>
                <ListItemIcon>
                  <Badge badgeContent={notifications.length} color='primary'>
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>
                {open && <ListItemText primary='Notificações' />}
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <main
          style={{
            padding: noPadding ? 0 : '24px',
            width: open ? 'calc(100% - 240px)' : '100%',
            overflow: blockOverflow ? 'hidden' : 'auto',
          }}
          className={`${styles.wrapperContent} ${classes.content}`}
        >
          <Breadcrumbs className={styles.boxBreadcrumb} aria-label='breadcrumb'>
            <Link color='inherit' href={absoluteUrl}>
              Home
            </Link>
            {itemsBreadcrumbs?.map((item, index) => {
              if (index === itemsBreadcrumbs.length - 1 || !item.page) {
                return <Typography color='textPrimary'>{item.name}</Typography>;
              }

              return (
                <Link
                  color='inherit'
                  href={`${absoluteUrl}/SitePages/${item.page}.aspx`}
                >
                  {item.name}
                </Link>
              );
            })}
          </Breadcrumbs>

          <Box height={maxHeight || 'calc(100vh - 7rem)'}>{children}</Box>
        </main>
      </div>
      <NotificationDrawer
        closeDrawer={() => closeDrawer()}
        open={openDrawerNotifications}
        onOpen={() => {}}
      />
    </MuiPickersUtilsProvider>
  );
};

export default Page;
