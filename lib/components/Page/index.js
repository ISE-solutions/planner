var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Drawer, List, CssBaseline, Divider, ListItem, ListItemText, Collapse, Link, ListItemIcon, Box, IconButton, Tooltip, Breadcrumbs, Typography, Badge, } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { FaUser, FaTag, FaInfinity, FaPuzzlePiece, FaSchool, FaAngleLeft, FaAngleRight, FaAward, FaUserFriends, FaCubes, FaTasks, FaTrashRestore, } from 'react-icons/fa';
import { MdWorkspacesFilled } from 'react-icons/md';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ExpandMore, ExpandLess, EventBusy, InsertChart, Timer, Search, } from '@material-ui/icons';
import { HiTemplate } from 'react-icons/hi';
import { sp } from '@pnp/sp';
import styles from './Page.module.scss';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { useLoggedUser } from '~/hooks';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { NotificationDrawer } from '../NotificationDrawer/index';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllNotification } from '~/store/modules/notification/actions';
import { PREFIX } from '~/config/database';
import { fetchAllEnvironmentReference } from '~/store/modules/environmentReference/actions';
import { fetchTooltips } from '~/store/modules/app/actions';
import '@react-awesome-query-builder/material/css/styles.css';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { BsCollectionFill } from 'react-icons/bs';
const drawerWidth = 240;
const useStyles = makeStyles((theme) => createStyles({
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
}));
const Page = ({ children, blockOverflow = true, noPadding, context, maxHeight, itemsBreadcrumbs, }) => {
    const classes = useStyles();
    const [openDrawerNotifications, setOpenDrawerNotifications] = React.useState(false);
    const [openMenu, setOpenMenu] = useState({});
    const [itemsMenu, setItemsMenu] = useState([]);
    const [allMenu, setAllMenu] = useState([]);
    const [open, setOpen] = React.useState(true);
    const { notifications } = useSelector((state) => state.notification);
    const dispatch = useDispatch();
    const { currentUser } = useLoggedUser();
    const _menu = sp.web.lists.getByTitle('Menu');
    React.useEffect(() => {
        if (currentUser) {
            dispatch(fetchTooltips());
            getMenu();
            dispatch(fetchAllEnvironmentReference());
            dispatch(fetchAllNotification({ pessoaId: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`] }));
        }
    }, [currentUser]);
    React.useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch(fetchAllNotification({ pessoaId: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`] }));
        }, 120000);
        return () => clearInterval(intervalId);
    }, [currentUser]);
    const handleOpenMenu = (Id) => {
        setOpenMenu(Object.assign(Object.assign({}, openMenu), { [Id]: !openMenu[Id] }));
    };
    const closeDrawer = () => {
        setOpenDrawerNotifications(false);
    };
    const getMenu = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const data = yield _menu.items
            .expand('InMenuPai')
            .select('Id, Title, InLink,InOrdem, InMenuPai/Id, InMenuPai/Title')
            .filter(`InAtivo eq 1`)
            .orderBy('InOrdem')
            .usingCaching()
            .get();
        setAllMenu(data);
        const itensChildren = data === null || data === void 0 ? void 0 : data.filter((e) => { var _a; return (_a = e.InMenuPai) === null || _a === void 0 ? void 0 : _a.Id; });
        const itensParent = (_a = data === null || data === void 0 ? void 0 : data.filter((e) => {
            var _a;
            if ((e === null || e === void 0 ? void 0 : e.Title) === 'Planejamento') {
                return currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning;
            }
            return !((_a = e.InMenuPai) === null || _a === void 0 ? void 0 : _a.Id);
        })) === null || _a === void 0 ? void 0 : _a.sort((a, b) => (a === null || a === void 0 ? void 0 : a.InOrdem) - (b === null || b === void 0 ? void 0 : b.InOrdem));
        itensParent.forEach((elm) => {
            var _a;
            elm.submenu = (_a = itensChildren === null || itensChildren === void 0 ? void 0 : itensChildren.filter((e) => e.InMenuPai.Id === elm.Id)) === null || _a === void 0 ? void 0 : _a.sort((a, b) => (a === null || a === void 0 ? void 0 : a.InOrdem) - (b === null || b === void 0 ? void 0 : b.InOrdem));
        });
        setItemsMenu(itensParent);
    });
    const handleDrawer = () => {
        setOpen(!open);
    };
    const menuIcon = {
        Programa: React.createElement(FaAward, { size: '1.3rem' }),
        Planejamento: React.createElement(HiTemplate, { size: '1.3rem' }),
        // 'Categoria Etiqueta': <MdCategory size='1.2rem' />,
        Etiqueta: React.createElement(FaTag, { size: '1.2rem' }),
        Espaço: React.createElement(MdWorkspacesFilled, { size: '1.2rem' }),
        'Recurso Finito': React.createElement(FaPuzzlePiece, { size: '1.2rem' }),
        Pessoa: React.createElement(FaUser, { size: '1.2rem' }),
        'Recurso Infinito': React.createElement(FaInfinity, { size: '1.2rem' }),
        'Atividade Acadêmica': React.createElement(FaSchool, { size: '1.2rem' }),
        'Atividade Não Acadêmica': React.createElement(FaSchool, { size: '1.2rem' }),
        'Atividade Interna': React.createElement(FaSchool, { size: '1.2rem' }),
        Modelos: React.createElement(FaPuzzlePiece, { size: '1.2rem' }),
        Dia: React.createElement(IoCalendarNumberSharp, { size: '1.2rem' }),
        Turma: React.createElement(FaUserFriends, { size: '1.2rem' }),
        Atividade: React.createElement(FaSchool, { size: '1.2rem' }),
        Tarefa: React.createElement(FaTasks, { size: '1.2rem' }),
        Recursos: React.createElement(FaCubes, { size: '1.2rem' }),
        'Gestão de Conflitos': React.createElement(EventBusy, null),
        Relatórios: React.createElement(InsertChart, null),
        Horário: React.createElement(Timer, null),
        'Consulta Avançada': React.createElement(Search, null),
        Lixeira: React.createElement(FaTrashRestore, { size: '1.2rem' }),
        Agrupamento: React.createElement(BsCollectionFill, { size: '1.2rem' }),
    };
    const urlActive = window.location.href;
    const itemActive = React.useMemo(() => {
        var _a;
        const item = allMenu.find((e) => { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.InLink) === null || _a === void 0 ? void 0 : _a.Url) === urlActive; });
        setOpenMenu(Object.assign(Object.assign({}, openMenu), { [((_a = item === null || item === void 0 ? void 0 : item.InMenuPai) === null || _a === void 0 ? void 0 : _a.Id) || (item === null || item === void 0 ? void 0 : item.Id)]: true }));
        return item;
    }, [urlActive, allMenu]);
    const absoluteUrl = context.pageContext.web.absoluteUrl;
    return (React.createElement(MuiPickersUtilsProvider, { utils: MomentUtils },
        React.createElement("div", { className: classes.root },
            React.createElement(CssBaseline, null),
            React.createElement(Drawer, { variant: 'permanent', id: 'drawerMenu', className: clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }), classes: {
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }, anchor: 'left' },
                React.createElement(Box, { position: 'absolute', right: '-.9rem', top: '1.3rem', zIndex: 9999 },
                    React.createElement(IconButton, { onClick: handleDrawer, className: styles.iconClose }, open ? (React.createElement(FaAngleLeft, { color: '#0063a5' })) : (React.createElement(FaAngleRight, { color: '#0063a5' })))),
                React.createElement(Divider, null),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between', flexDirection: 'column', minHeight: 'calc(100vh - 3rem)' },
                    React.createElement(List, { className: styles.wrapperMenu }, itemsMenu.map(({ Id, Title, icon, InLink, submenu }) => (React.createElement(React.Fragment, null, submenu && submenu.length ? (React.createElement(React.Fragment, null,
                        React.createElement(ListItem, { button: true, key: Title, onClick: () => handleOpenMenu(Id), className: `${(itemActive === null || itemActive === void 0 ? void 0 : itemActive.Id) === Id && styles.activeMenu} ${classes.nested}` },
                            React.createElement(Tooltip, { arrow: true, title: Title },
                                React.createElement(ListItemIcon, null, menuIcon[Title])),
                            open && (React.createElement(React.Fragment, null,
                                React.createElement(ListItemText, { primary: React.createElement("span", { className: styles.titleMenu }, Title) }),
                                openMenu[Id] ? (React.createElement(ExpandMore, { fontSize: 'small' })) : (React.createElement(ExpandLess, { fontSize: 'small' }))))),
                        React.createElement(Collapse, { in: openMenu[Id], timeout: 'auto', style: open && { paddingLeft: '1rem' }, unmountOnExit: true }, submenu.map((sub) => {
                            var _a;
                            return (React.createElement(List, { component: 'div', disablePadding: true },
                                React.createElement(Link, { href: (_a = sub === null || sub === void 0 ? void 0 : sub.InLink) === null || _a === void 0 ? void 0 : _a.Url, color: 'inherit', style: { textDecoration: 'none' } },
                                    React.createElement(ListItem, { button: true, className: `${(itemActive === null || itemActive === void 0 ? void 0 : itemActive.Id) === (sub === null || sub === void 0 ? void 0 : sub.Id) &&
                                            styles.activeMenu} ${classes.nested}` },
                                        React.createElement(Tooltip, { arrow: true, title: sub.Title },
                                            React.createElement(ListItemIcon, null, menuIcon[sub.Title])),
                                        open && (React.createElement(ListItemText, { className: styles.itemMenu, primary: sub.Title }))))));
                        })))) : (React.createElement(Link, { href: InLink === null || InLink === void 0 ? void 0 : InLink.Url, color: 'inherit', style: { textDecoration: 'none' } },
                        React.createElement(ListItem, { button: true, className: `${(itemActive === null || itemActive === void 0 ? void 0 : itemActive.Id) === Id && styles.activeMenu} ${classes.nested}` },
                            React.createElement(Tooltip, { arrow: true, title: Title },
                                React.createElement(ListItemIcon, null, menuIcon[Title])),
                            open && React.createElement(ListItemText, { primary: Title })))))))),
                    React.createElement(List, null,
                        React.createElement(ListItem, { onClick: () => setOpenDrawerNotifications(true), button: true },
                            React.createElement(ListItemIcon, null,
                                React.createElement(Badge, { badgeContent: notifications.length, color: 'primary' },
                                    React.createElement(NotificationsIcon, null))),
                            open && React.createElement(ListItemText, { primary: 'Notifica\u00E7\u00F5es' }))))),
            React.createElement("main", { style: {
                    padding: noPadding ? 0 : '24px',
                    width: open ? 'calc(100% - 240px)' : '100%',
                    overflow: blockOverflow ? 'hidden' : 'auto',
                }, className: `${styles.wrapperContent} ${classes.content}` },
                React.createElement(Breadcrumbs, { className: styles.boxBreadcrumb, "aria-label": 'breadcrumb' },
                    React.createElement(Link, { color: 'inherit', href: absoluteUrl }, "Home"), itemsBreadcrumbs === null || itemsBreadcrumbs === void 0 ? void 0 :
                    itemsBreadcrumbs.map((item, index) => {
                        if (index === itemsBreadcrumbs.length - 1 || !item.page) {
                            return React.createElement(Typography, { color: 'textPrimary' }, item.name);
                        }
                        return (React.createElement(Link, { color: 'inherit', href: `${absoluteUrl}/SitePages/${item.page}.aspx` }, item.name));
                    })),
                React.createElement(Box, { height: maxHeight || 'calc(100vh - 7rem)' }, children))),
        React.createElement(NotificationDrawer, { closeDrawer: () => closeDrawer(), open: openDrawerNotifications, onOpen: () => { } })));
};
export default Page;
//# sourceMappingURL=index.js.map