import * as React from 'react';
import Page from '~/components/Page';
import { useLoggedUser, useScheduleDay, useTeam, } from '~/hooks';
import { PREFIX } from '~/config/database';
import AccordionVertical from '~/components/AccordionVertical';
import ListModels from './components/ListModels';
import Calendar from './components/Calendar';
import ListDays from './components/ListDays';
import { Box, Typography } from '@material-ui/core';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { getTeamById } from '~/store/modules/team/actions';
const TeamModelPage = ({ context }) => {
    const [teamChoosed, setTeamChoosed] = React.useState();
    const [scheduleChoosed, setScheduleChoosed] = React.useState();
    const [filter, setFilter] = React.useState({
        searchQuery: '',
        active: 'Ativo',
        model: true,
        programId: null,
        filterProgram: true,
    });
    const queryParameters = new URLSearchParams(window.location.search);
    const modelIdParam = queryParameters.get('modelid');
    const dispatch = useDispatch();
    const [{ schedule, refetch: refetchSchedule }] = useScheduleDay({
        teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`],
        active: 'Ativo',
        model: true,
    }, { manual: true });
    const { currentUser } = useLoggedUser();
    const [{ loading, loadingSave, teams, addOrUpdateTeam, refetch: refetchTeam },] = useTeam(filter);
    React.useEffect(() => {
        if (modelIdParam) {
            getTeamById(modelIdParam).then(({ value }) => setTeamChoosed(value[0]));
        }
    }, [modelIdParam]);
    React.useEffect(() => {
        dispatch(fetchAllFiniteInfiniteResources({}));
    }, []);
    React.useEffect(() => {
        if (teamChoosed) {
            refetchSchedule();
        }
    }, [teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`]]);
    const canEdit = React.useMemo(() => {
        if (currentUser && teamChoosed) {
            return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ||
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                    (teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}criadopor_value`]));
        }
        return false;
    }, [currentUser, teamChoosed]);
    return (React.createElement(Page, { context: context, itemsBreadcrumbs: [
            { name: 'Modelos', page: 'Cronograma Modelo' },
            { name: 'Turma', page: 'Modelo Turma' },
        ] },
        React.createElement(AccordionVertical, { defaultExpanded: true, title: 'Modelos de Turma', width: 260, expansibleColumn: React.createElement(ListModels, { context: context, loading: loading, currentUser: currentUser, loadingSave: loadingSave, teams: teams, filter: filter, setFilter: setFilter, refetch: refetchTeam, refetchSchedule: refetchSchedule, teamChoosed: teamChoosed, setTeamChoosed: setTeamChoosed, handleSchedule: (sch) => setTeamChoosed(sch) }) }, teamChoosed ? (React.createElement(AccordionVertical, { defaultExpanded: true, title: 'Modelos de Turma', width: 260, expansibleColumn: React.createElement(ListDays, { canEdit: canEdit, schedules: schedule, context: context, refetch: refetchSchedule, scheduleChoosed: scheduleChoosed, teamChoosed: teamChoosed, handleSchedule: (sch) => setScheduleChoosed(sch) }) }, scheduleChoosed ? (React.createElement(Calendar, { canEdit: canEdit, context: context, schedules: schedule, scheduleChoosed: scheduleChoosed, refetchSchedule: refetchSchedule, refetchTeam: refetchTeam, teamChoosed: teamChoosed })) : (React.createElement(Box, { display: 'flex', height: '100%', width: '55rem', justifyContent: 'center', alignItems: 'center' },
            React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                React.createElement(IoCalendarNumberSharp, { color: '#0063a5', size: '5rem' }),
                React.createElement(Typography, { variant: 'h5', color: 'primary', style: { fontWeight: 'bold' } }, "Escolha um dia")))))) : (React.createElement(Box, { display: 'flex', height: '100%', width: '55rem', justifyContent: 'center', alignItems: 'center' },
            React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                React.createElement(IoCalendarNumberSharp, { color: '#0063a5', size: '5rem' }),
                React.createElement(Typography, { variant: 'h5', color: 'primary', style: { fontWeight: 'bold' } }, "Escolha um modelo")))))));
};
export default TeamModelPage;
//# sourceMappingURL=TeamModelPage.js.map