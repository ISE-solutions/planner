import { Box, Button, Divider, Grid, IconButton, List, ListItem, ListItemText, SwipeableDrawer, Tooltip, } from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PREFIX } from '~/config/database';
import { fetchAllNotification, readAllNotification, readNotification, } from '~/store/modules/notification/actions';
import { useLoggedUser, useNotification } from '~/hooks';
import { truncateString } from '~/store/modules/notification/utils';
import { ListDrawer, TextNotification, StyledListItem, StyledCard, StyledTitle, } from './styles';
import TimeAgo from 'javascript-time-ago';
import pt from 'javascript-time-ago/locale/pt';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Close, NotificationsNone, Refresh, Visibility, } from '@material-ui/icons';
TimeAgo.addDefaultLocale(pt);
const timeAgo = new TimeAgo('en-US');
export const NotificationDrawer = ({ onOpen, open, closeDrawer, }) => {
    const { currentUser } = useLoggedUser();
    const [loading, setLoading] = React.useState(false);
    const { notification } = useNotification();
    const dispatch = useDispatch();
    const handleReadAllNotifications = () => {
        setLoading(true);
        readAllNotification(notifications === null || notifications === void 0 ? void 0 : notifications.map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}notificacaoid`]), {
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
        });
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
                dispatch(fetchAllNotification({
                    pessoaId: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
                }));
            },
            onError: (err) => {
                var _a, _b;
                setLoading(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        });
    };
    const { notifications } = useSelector((state) => state.notification);
    const handleUpdateNotifications = () => {
        dispatch(fetchAllNotification({ pessoaId: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`] }));
    };
    const list = () => (React.createElement(Box, { display: 'flex', alignItems: 'flex-start', flexDirection: 'column', style: { gap: '1rem' } },
        React.createElement(Button, { variant: 'contained', color: 'primary', startIcon: React.createElement(CheckCircleIcon, null), onClick: () => handleReadAllNotifications() }, "Marcar todos como lido"),
        React.createElement(Divider, null),
        React.createElement(List, null,
            React.createElement(ListItem, { alignItems: 'flex-start' },
                React.createElement(ListDrawer, null, notifications.map((n) => {
                    return (React.createElement(React.Fragment, null,
                        React.createElement(Grid, { justifyContent: 'space-evenly', direction: 'row', container: true },
                            React.createElement(Grid, { item: true, xs: 11, style: { cursor: 'pointer' }, onClick: () => {
                                    handleReadNotification(n === null || n === void 0 ? void 0 : n[`${PREFIX}notificacaoid`]);
                                    (n === null || n === void 0 ? void 0 : n[`${PREFIX}link`])
                                        ? window.open(n === null || n === void 0 ? void 0 : n[`${PREFIX}link`], '_blank').focus()
                                        : null;
                                } },
                                React.createElement(TextNotification, null,
                                    React.createElement(ListItemText, { primaryTypographyProps: {
                                            style: { width: '300px' },
                                        }, primary: n === null || n === void 0 ? void 0 : n[`${PREFIX}titulo`], secondary: React.createElement(Tooltip, { title: (n === null || n === void 0 ? void 0 : n[`${PREFIX}descricao`]) || '' },
                                            React.createElement("span", null, truncateString(n === null || n === void 0 ? void 0 : n[`${PREFIX}descricao`], 50))) }),
                                    React.createElement(ListItemText, { primaryTypographyProps: {
                                            style: { width: '300px' },
                                        }, primary: timeAgo.format(new Date(n.createdon)) }))),
                            React.createElement(Grid, { item: true, xs: 1 },
                                React.createElement(IconButton, { onClick: () => handleReadNotification(n === null || n === void 0 ? void 0 : n[`${PREFIX}notificacaoid`]) },
                                    React.createElement(Visibility, null))))));
                }))))));
    return (React.createElement(React.Fragment, null,
        React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: () => { }, onOpen: () => { } },
            React.createElement(IconButton, { "aria-label": 'close', onClick: closeDrawer, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null)),
            React.createElement(Box, { width: '25rem', padding: '1rem' },
                notifications.length != 0 && list(),
                notifications.length == 0 && (React.createElement(React.Fragment, null,
                    React.createElement(StyledListItem, { style: { width: '100%', height: '100%' }, className: 'list', role: 'presentation', onKeyDown: () => closeDrawer() },
                        React.createElement(StyledCard, { variant: 'outlined' },
                            React.createElement(NotificationsNone, { fontSize: 'large' }),
                            React.createElement(StyledTitle, { color: 'textSecondary', gutterBottom: true }, "Voc\u00EA n\u00E3o possui notifica\u00E7\u00E3o."),
                            React.createElement(Button, { fullWidth: true, onClick: handleUpdateNotifications, startIcon: React.createElement(Refresh, null), size: 'medium', variant: 'contained', color: 'primary' }, "Atualizar")))))))));
};
//# sourceMappingURL=index.js.map