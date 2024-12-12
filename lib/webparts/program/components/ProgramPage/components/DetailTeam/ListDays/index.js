import * as React from 'react';
import * as moment from 'moment';
import { Box, Menu, MenuItem, Typography } from '@material-ui/core';
import { PREFIX } from '~/config/database';
import LayerDay from './LayerDay';
import CloneActivity from './CloneActivity';
const ListDays = ({ schedules, refetchActivity, dictTag, teamChoosed, programChoosed, activities, handleDelete, handleToSaveActivityModel, handleOptionSchedule, handleActivityDetail, }) => {
    const [anchorActivityEl, setAnchorActivityEl] = React.useState(null);
    const [activityChoosed, setActivityChoosed] = React.useState(null);
    const [openCloneActivity, setOpenCloneActivity] = React.useState(false);
    const handleOptionActivity = (event, item) => {
        setActivityChoosed(item);
        setAnchorActivityEl(event.currentTarget);
    };
    const handleCloseActivityAnchor = () => {
        setAnchorActivityEl(null);
    };
    const handleDetailActivity = (act) => {
        handleActivityDetail(act || activityChoosed);
        handleCloseActivityAnchor();
    };
    const handleOpenCloneActivity = () => {
        setOpenCloneActivity(true);
        handleCloseActivityAnchor();
    };
    const schedulesList = React.useMemo(() => {
        var _a;
        return (_a = schedules === null || schedules === void 0 ? void 0 : schedules.map((sch) => {
            var _a;
            let hasConflict = false;
            sch.activities = (_a = activities
                .filter((actv) => {
                const isFromDay = moment
                    .utc(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}datahorainicio`])
                    .format('DD/MM/YYYY') ===
                    moment.utc(sch === null || sch === void 0 ? void 0 : sch[`${PREFIX}data`]).format('DD/MM/YYYY');
                if (isFromDay && !hasConflict && (actv === null || actv === void 0 ? void 0 : actv.hasConflict)) {
                    hasConflict = true;
                }
                return isFromDay;
            })) === null || _a === void 0 ? void 0 : _a.sort((a, b) => moment(a === null || a === void 0 ? void 0 : a[`${PREFIX}inicio`], 'HH:mm').unix() -
                moment(b === null || b === void 0 ? void 0 : b[`${PREFIX}inicio`], 'HH:mm').unix());
            sch.hasConflict = hasConflict;
            return sch;
        })) === null || _a === void 0 ? void 0 : _a.sort((left, right) => moment
            .utc(left === null || left === void 0 ? void 0 : left[`${PREFIX}data`])
            .diff(moment.utc(right === null || right === void 0 ? void 0 : right[`${PREFIX}data`])));
    }, [schedules, activities]);
    return (React.createElement(React.Fragment, null,
        React.createElement(CloneActivity, { open: openCloneActivity, schedules: schedules, refetchActivity: refetchActivity, activity: activityChoosed, onClose: () => setOpenCloneActivity(false) }),
        React.createElement(Menu, { anchorEl: anchorActivityEl, keepMounted: true, open: Boolean(anchorActivityEl), onClose: handleCloseActivityAnchor },
            React.createElement(MenuItem, { onClick: () => handleDetailActivity() }, "Detalhar"),
            React.createElement(MenuItem, { onClick: handleOpenCloneActivity }, "Clonar"),
            React.createElement(MenuItem, { onClick: () => {
                    handleCloseActivityAnchor();
                    handleToSaveActivityModel(activityChoosed);
                } }, "Salvar como Modelo"),
            React.createElement(MenuItem, { onClick: () => {
                    handleCloseActivityAnchor();
                    handleDelete(activityChoosed === null || activityChoosed === void 0 ? void 0 : activityChoosed[`${PREFIX}atividadeid`]);
                } }, "Excluir")),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', width: 'calc(100% - 3rem)', style: { gap: '1rem' } },
            React.createElement(Box, { display: 'flex', overflow: 'auto', id: 'DayCalendarList', height: 'calc(100vh - 11rem)', paddingBottom: '10px', margin: '0 -5px', style: { gap: '1rem' } }, (schedulesList === null || schedulesList === void 0 ? void 0 : schedulesList.length) ? (React.createElement(React.Fragment, null, schedulesList === null || schedulesList === void 0 ? void 0 : schedulesList.map((sched) => (React.createElement(LayerDay, { schedule: sched, teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], refetchActivity: refetchActivity, handleDetailActivity: handleDetailActivity, handleSchedule: handleOptionSchedule, handleOptionActivity: handleOptionActivity, teamChoosed: teamChoosed, programChoosed: programChoosed }))))) : (React.createElement(Typography, { variant: 'body1' }, "Nenhum Dia de aula cadastrado"))))));
};
export default ListDays;
//# sourceMappingURL=index.js.map