import * as React from 'react';
import { Box, Divider, Menu, MenuItem, TextField, Tooltip, Typography, } from '@material-ui/core';
import { AddButton, StyledCard, StyledContentCard, StyledHeaderCard, StyledIconButton, Title, TitleCard, } from '~/components/CustomCard';
import { Add, MoreVert } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import * as moment from 'moment';
import { deleteSchedule } from '~/store/modules/schedule/actions';
import { useConfirmation } from '~/hooks';
import { useDispatch } from 'react-redux';
const ListDays = ({ schedules, canEdit, context, teamChoosed, scheduleChoosed, refetch, handleSchedule, }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [visible, setVisible] = React.useState(false);
    const [itemSelected, setItemSelected] = React.useState(null);
    const { confirmation } = useConfirmation();
    const dispatch = useDispatch();
    const handleClose = () => {
        setVisible(false);
        refetch();
        setItemSelected(null);
    };
    const handleOption = (event, item) => {
        setItemSelected(item);
        setAnchorEl(event.currentTarget);
    };
    const handleCloseAnchor = () => {
        setAnchorEl(null);
    };
    const handleDetail = () => {
        setVisible(true);
        handleCloseAnchor();
    };
    const handleDeleteSchedule = () => {
        handleCloseAnchor();
        confirmation.openConfirmation({
            title: 'Confirmação da ação',
            description: `Tem certeza que deseja excluir o dia ${moment
                .utc(itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}data`])
                .format('DD/MM')}?`,
            onConfirm: () => {
                dispatch(deleteSchedule(itemSelected[`${PREFIX}cronogramadediaid`], [], {
                    onSuccess: refetch,
                    onError: () => null,
                }));
            },
        });
    };
    const schedulesList = React.useMemo(() => schedules === null || schedules === void 0 ? void 0 : schedules.sort((left, right) => moment
        .utc(left === null || left === void 0 ? void 0 : left[`${PREFIX}data`])
        .diff(moment.utc(right === null || right === void 0 ? void 0 : right[`${PREFIX}data`]))), [schedules]);
    return (React.createElement(React.Fragment, null,
        React.createElement(ScheduleDayForm, { isModel: true, titleRequired: false, visible: visible, context: context, schedule: itemSelected, team: teamChoosed, setSchedule: (sch) => setItemSelected(sch), teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], handleClose: handleClose }),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
            React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                React.createElement(Title, null, "Dias"),
                canEdit ? (React.createElement(Tooltip, { arrow: true, title: 'Novo Programa' },
                    React.createElement(AddButton, { variant: 'contained', color: 'primary', onClick: () => setVisible(true) },
                        React.createElement(Add, null)))) : null),
            React.createElement(TextField, { label: 'Pesquisar', InputProps: {
                    endAdornment: React.createElement(React.Fragment, null),
                } }),
            React.createElement(Menu, { anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: handleCloseAnchor },
                React.createElement(MenuItem, { onClick: handleDetail }, "Detalhar"),
                React.createElement(MenuItem, { onClick: handleDeleteSchedule }, "Excluir")),
            React.createElement(Box, { display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: 'calc(100vh - 17rem)', paddingBottom: '10px', margin: '0 -5px', style: { gap: '1rem' } }, (schedulesList === null || schedulesList === void 0 ? void 0 : schedulesList.length) ? (React.createElement(React.Fragment, null, schedulesList === null || schedulesList === void 0 ? void 0 : schedulesList.map((schedule) => {
                var _a;
                return (React.createElement(StyledCard, { key: schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}cronogramadediaid`], active: (scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`${PREFIX}cronogramadediaid`]) ===
                        (schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}cronogramadediaid`]), elevation: 3 },
                    React.createElement(StyledHeaderCard, { action: React.createElement(Tooltip, { arrow: true, title: 'A\u00E7\u00F5es' },
                            React.createElement(StyledIconButton, { "aria-label": 'settings', onClick: (event) => handleOption(event, schedule) },
                                React.createElement(MoreVert, null))), title: React.createElement(Tooltip, { arrow: true, title: (schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}nome`]) || 'Sem informações' },
                            React.createElement(TitleCard, { onClick: () => handleSchedule(schedule) }, schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}nome`])) }),
                    React.createElement(StyledContentCard, { onClick: () => handleSchedule(schedule) },
                        React.createElement(Divider, null),
                        React.createElement(Typography, { variant: 'body1' }, moment.utc(schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}data`]).format('DD/MM')),
                        React.createElement(Typography, { variant: 'body2' }, (_a = schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}Modulo`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]))));
            }))) : (React.createElement(Typography, { variant: 'body1' }, "Nenhum dia cadastrado"))))));
};
export default ListDays;
//# sourceMappingURL=index.js.map