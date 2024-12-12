import * as React from 'react';
import Page from '~/components/Page';
import { useLoggedUser, useScheduleDay } from '~/hooks';
import { PREFIX } from '~/config/database';
import AccordionVertical from '~/components/AccordionVertical';
import ListModels from './components/ListModels';
import CalendarDay from './components/CalendarDay';
import { Box, Typography } from '@material-ui/core';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { getScheduleId } from '~/store/modules/schedule/actions';
const ScheduleModelPage = ({ context }) => {
    const [scheduleChoosed, setScheduleChoosed] = React.useState();
    const [filter, setFilter] = React.useState({
        active: 'Ativo',
        group: 'Não',
        searchQuery: '',
        model: true,
        filterTeam: true,
        teamId: null,
    });
    const queryParameters = new URLSearchParams(window.location.search);
    const modelIdParam = queryParameters.get('modelid');
    const dispatch = useDispatch();
    const { currentUser } = useLoggedUser();
    const [{ schedule, loading, refetch }] = useScheduleDay(filter);
    React.useEffect(() => {
        if (modelIdParam) {
            getScheduleId(modelIdParam).then(({ value }) => setScheduleChoosed(value[0]));
        }
    }, [modelIdParam]);
    React.useEffect(() => {
        dispatch(fetchAllSpace({}));
        dispatch(fetchAllFiniteInfiniteResources({}));
    }, []);
    React.useEffect(() => {
        if ((schedule === null || schedule === void 0 ? void 0 : schedule.length) && scheduleChoosed) {
            const scheduleChoosedIndex = schedule.findIndex((item) => (item === null || item === void 0 ? void 0 : item[`${PREFIX}cronogramadediaid`]) ===
                (scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`${PREFIX}cronogramadediaid`]));
            if (scheduleChoosedIndex > -1) {
                setScheduleChoosed(schedule[scheduleChoosedIndex]);
            }
        }
    }, [schedule]);
    const canEdit = React.useMemo(() => {
        if (currentUser && scheduleChoosed) {
            return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ||
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                    (scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`_${PREFIX}criadopor_value`]));
        }
        return false;
    }, [currentUser, scheduleChoosed]);
    return (React.createElement(Page, { context: context, itemsBreadcrumbs: [
            { name: 'Modelos', page: 'Cronograma Modelo' },
            { name: 'Dia', page: 'Cronograma Modelo' },
        ] },
        React.createElement(AccordionVertical, { defaultExpanded: true, title: 'Modelos de Dia', width: 290, expansibleColumn: React.createElement(ListModels, { context: context, refetch: refetch, currentUser: currentUser, filter: filter, canEdit: canEdit, setFilter: setFilter, schedule: schedule, loading: loading, scheduleChoosed: scheduleChoosed, handleSchedule: (sch) => setScheduleChoosed(sch) }) }, scheduleChoosed ? (React.createElement(CalendarDay, { canEdit: canEdit, scheduleChoosed: scheduleChoosed, refetch: refetch })) : (React.createElement(Box, { display: 'flex', height: '100%', width: '55rem', justifyContent: 'center', alignItems: 'center' },
            React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                React.createElement(IoCalendarNumberSharp, { color: '#0063a5', size: '5rem' }),
                React.createElement(Typography, { variant: 'h5', color: 'primary', style: { fontWeight: 'bold' } }, "Escolha um modelo")))))));
};
export default ScheduleModelPage;
//# sourceMappingURL=ScheduleModelPage.js.map