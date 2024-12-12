import * as React from 'react';
import Page from '~/components/Page';
import AccordionVertical from '~/components/AccordionVertical';
import ListPrograms from './components/ListPrograms';
import DetailProgram from './components/DetailProgram';
import DetailTeam from './components/DetailTeam';
import ListDays from './components/ListDays';
import { Box, Typography } from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { useLoggedUser, useScheduleDay, useTeam } from '~/hooks';
import { FaAward, FaUserFriends } from 'react-icons/fa';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { getProgramId } from '~/store/modules/program/actions';
const ProgramModelPage = ({ context }) => {
    var _a;
    const [scheduleChoosed, setScheduleChoosed] = React.useState(null);
    const [programChoosed, setProgramChoosed] = React.useState(null);
    const [teamChoosed, setTeamChoosed] = React.useState(null);
    const [listMode, setListMode] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const queryParameters = new URLSearchParams(window.location.search);
    const modelIdParam = queryParameters.get('modelid');
    const dispatch = useDispatch();
    const { currentUser } = useLoggedUser();
    const [{ schedule, addUpdateSchedule, refetch: refetchSchedule }] = useScheduleDay({
        teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`],
        active: 'Ativo',
        model: true,
    }, { manual: true });
    const [{ loading, teams, refetch: refetchTeam }] = useTeam({
        programId: programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}programaid`],
        active: 'Ativo',
        searchQuery: search,
        model: true,
    });
    React.useEffect(() => {
        if (modelIdParam) {
            getProgramId(modelIdParam).then(({ value }) => setProgramChoosed(value[0]));
        }
    }, [modelIdParam]);
    React.useEffect(() => {
        dispatch(fetchAllSpace({}));
        dispatch(fetchAllFiniteInfiniteResources({}));
    }, []);
    React.useEffect(() => {
        if (teamChoosed) {
            refetchSchedule();
        }
    }, [teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`]]);
    React.useEffect(() => {
        setTeamChoosed(null);
    }, [programChoosed]);
    const handleModeView = () => {
        setListMode(!listMode);
        setScheduleChoosed(null);
    };
    const canEdit = React.useMemo(() => {
        if (currentUser && programChoosed) {
            return (!!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ||
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                    (programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`_${PREFIX}criadopor_value`]));
        }
        return false;
    }, [currentUser, programChoosed]);
    return (React.createElement(Page, { noPadding: true, context: context, itemsBreadcrumbs: [
            { name: 'Modelos', page: 'Dia de aula Modelo' },
            { name: 'Programa', page: 'Modelo Programa' },
        ] },
        React.createElement(AccordionVertical, { defaultExpanded: true, title: 'Modelos', width: 260, expansibleColumn: React.createElement(ListPrograms, { context: context, currentUser: currentUser, programChoosed: programChoosed, setProgramChoosed: setProgramChoosed, handleProgram: (program) => setProgramChoosed(program) }) },
            React.createElement(AccordionVertical, { defaultExpanded: true, title: ((_a = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ||
                    'Escolha um Programa', width: 260, expansibleColumn: React.createElement(React.Fragment, null, programChoosed ? (React.createElement(DetailProgram, { context: context, canEdit: canEdit, setSearch: setSearch, loading: loading, teams: teams, refetch: refetchTeam, programChoosed: programChoosed, teamChoosed: teamChoosed, setTeamChoosed: setTeamChoosed })) : (React.createElement(Box, { display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' },
                    React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                        React.createElement(FaAward, { color: '#0063a5', style: { fontSize: '5rem' } }),
                        React.createElement(Typography, { variant: 'h5', color: 'primary', style: { fontWeight: 'bold' } }, "Escolha um Modelo"))))) }, React.createElement(React.Fragment, null, teamChoosed ? (React.createElement(React.Fragment, null, listMode ? (React.createElement(AccordionVertical, { defaultExpanded: true, title: (teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}nome`]) || 'Escolha uma Turma', width: 270, expansibleColumn: React.createElement(ListDays, { canEdit: canEdit, schedules: schedule, scheduleChoosed: scheduleChoosed, setScheduleChoosed: setScheduleChoosed, addUpdateSchedule: addUpdateSchedule, context: context, teamChoosed: teamChoosed, programChoosed: programChoosed, teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], refetchSchedule: refetchSchedule, refetchTeam: refetchTeam }) }, scheduleChoosed ? (React.createElement(DetailTeam, { context: context, canEdit: canEdit, listMode: listMode, schedules: schedule, handleModeView: handleModeView, refetchTeam: refetchTeam, refetchSchedule: refetchSchedule, scheduleChoosed: scheduleChoosed, teamChoosed: teamChoosed, programChoosed: programChoosed })) : (React.createElement(Box, { display: 'flex', height: '100%', width: '20rem', justifyContent: 'center', alignItems: 'center' },
                React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                    React.createElement(IoCalendarNumberSharp, { color: '#0063a5', size: '5rem' }),
                    React.createElement(Typography, { variant: 'h6', color: 'primary', style: { fontWeight: 'bold' } }, "Escolha um dia de aula")))))) : (React.createElement(Box, { marginRight: '1rem' },
                React.createElement(DetailTeam, { context: context, canEdit: canEdit, listMode: listMode, schedules: schedule, handleModeView: () => setListMode(!listMode), refetchTeam: refetchTeam, scheduleChoosed: scheduleChoosed, refetchSchedule: refetchSchedule, teamChoosed: teamChoosed, programChoosed: programChoosed }))))) : (React.createElement(Box, { display: 'flex', height: '100%', width: '55rem', justifyContent: 'center', alignItems: 'center' },
                React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                    React.createElement(FaUserFriends, { color: '#0063a5', size: '5rem' }),
                    React.createElement(Typography, { variant: 'h5', color: 'primary', style: { fontWeight: 'bold' } }, "Escolha uma turma")))))))));
};
export default ProgramModelPage;
//# sourceMappingURL=ProgramModelPage.js.map