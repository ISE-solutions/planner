import { Box, CircularProgress, Typography } from '@material-ui/core';
import * as React from 'react';
import { FaAward, FaUserFriends } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import AccordionVertical from '~/components/AccordionVertical';
import Page from '~/components/Page';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import { useLoggedUser, useResource, useScheduleDay } from '~/hooks';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { fetchAllTeams } from '~/store/modules/team/actions';
import DetailProgram from './components/DetailProgram';
import DetailTeam from './components/DetailTeam';
import ListPrograms from './components/ListPrograms';
import { fetchAllPrograms, getProgramId, } from '~/store/modules/program/actions';
import { getActivity } from '~/store/modules/activity/actions';
import { TYPE_PROGRAM_FILTER } from '~/store/modules/program/utils';
import * as moment from 'moment';
import { Backdrop } from '~/components';
const ProgramPage = ({ context }) => {
    var _a;
    const [programChoosed, setProgramChoosed] = React.useState(null);
    const [teamChoosed, setTeamChoosed] = React.useState(null);
    const [activityChoosed, setActivityChoosed] = React.useState({
        open: false,
        item: null,
    });
    const [listMode, setListMode] = React.useState(true);
    const refFirstRender = React.useRef(true);
    const [filterProgram, setFilterProgram] = React.useState({
        active: 'Ativo',
        type: TYPE_PROGRAM_FILTER.PROGRAMA,
        model: false,
    });
    const queryParameters = new URLSearchParams(window.location.search);
    const programIdParam = queryParameters.get('programid');
    const activityIdParam = queryParameters.get('activityid');
    const dispatch = useDispatch();
    const [{ resources, loading, fetchResources, getResources }] = useResource({}, { manual: true });
    const { currentUser } = useLoggedUser();
    const { tag, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictPeople } = person;
    const [{ schedule, refetch: refetchSchedule, updateSchedule }] = useScheduleDay({
        teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`],
        active: 'Ativo',
    }, { manual: true });
    const refetchResource = () => {
        var _a, _b;
        const start = (_a = schedule === null || schedule === void 0 ? void 0 : schedule[0]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}data`];
        const end = (_b = schedule === null || schedule === void 0 ? void 0 : schedule[(schedule === null || schedule === void 0 ? void 0 : schedule.length) - 1]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}data`];
        fetchResources({
            startDate: moment.utc(start),
            endDate: moment.utc(end),
        });
    };
    React.useEffect(() => {
        const firstRender = refFirstRender.current;
        if (firstRender) {
            refFirstRender.current = false;
        }
    }, []);
    React.useEffect(() => {
        if (schedule === null || schedule === void 0 ? void 0 : schedule.length) {
            refetchResource();
        }
    }, [schedule]);
    React.useEffect(() => {
        if (activityIdParam) {
            getActivity(activityIdParam).then(({ value }) => setActivityChoosed({ open: true, item: value[0] }));
        }
    }, [activityIdParam]);
    React.useEffect(() => {
        if (programIdParam) {
            getProgramId(programIdParam).then(({ value }) => setProgramChoosed(value[0]));
        }
    }, [programIdParam]);
    React.useEffect(() => {
        dispatch(fetchAllSpace({}));
        dispatch(fetchAllFiniteInfiniteResources({}));
    }, []);
    React.useEffect(() => {
        if (programChoosed) {
            refetchTeam({
                programId: programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}programaid`],
                active: 'Ativo',
                model: false,
            });
        }
    }, [programChoosed]);
    React.useEffect(() => {
        if (teamChoosed) {
            refetchSchedule();
        }
    }, [teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`]]);
    React.useEffect(() => {
        setTeamChoosed(null);
    }, [programChoosed]);
    const refetchTeam = (ftr) => {
        dispatch(fetchAllTeams(ftr || {
            programId: programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}programaid`],
            active: 'Ativo',
            model: false,
        }));
    };
    const refetchProgram = (ftr) => {
        dispatch(fetchAllPrograms(ftr || filterProgram));
    };
    const isProgramResponsible = React.useMemo(() => {
        if (dictPeople && dictTag) {
            return programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}Programa_PessoasEnvolvidas`].some((envol) => {
                const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}funcao_value`]];
                const envolPerson = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}pessoa_value`]];
                if ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.RESPONSAVEL_PELO_PROGRAMA) {
                    return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                        (envolPerson === null || envolPerson === void 0 ? void 0 : envolPerson[`${PREFIX}pessoaid`]));
                }
                return false;
            });
        }
    }, [currentUser, programChoosed, dictPeople]);
    const isProgramDirector = React.useMemo(() => {
        if (dictPeople && dictTag) {
            return programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}Programa_PessoasEnvolvidas`].some((envol) => {
                const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}funcao_value`]];
                const envolPerson = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}pessoa_value`]];
                if ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA) {
                    return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                        (envolPerson === null || envolPerson === void 0 ? void 0 : envolPerson[`${PREFIX}pessoaid`]));
                }
                return false;
            });
        }
    }, [currentUser, programChoosed, dictPeople]);
    const isFinance = React.useMemo(() => {
        if (dictPeople && dictTag) {
            return programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}Programa_PessoasEnvolvidas`].some((envol) => {
                const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}funcao_value`]];
                const envolPerson = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}pessoa_value`]];
                if ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.FINANCEIRO) {
                    return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                        (envolPerson === null || envolPerson === void 0 ? void 0 : envolPerson[`${PREFIX}pessoaid`]));
                }
                return false;
            });
        }
    }, [currentUser, programChoosed, dictPeople]);
    const isHeadOfService = React.useMemo(() => {
        if (dictPeople && dictTag) {
            return programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}Programa_PessoasEnvolvidas`].some((envol) => {
                const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}funcao_value`]];
                const envolPerson = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}pessoa_value`]];
                if ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.FINANCEIRO) {
                    return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                        (envolPerson === null || envolPerson === void 0 ? void 0 : envolPerson[`${PREFIX}pessoaid`]));
                }
                return false;
            });
        }
    }, [currentUser, programChoosed, dictPeople]);
    const programTemperature = React.useMemo(() => { var _a; return (_a = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]; }, [programChoosed]);
    const teamTemperature = React.useMemo(() => { var _a; return (_a = teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]; }, [teamChoosed]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Backdrop, { open: loading },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(Page, { noPadding: true, context: context, itemsBreadcrumbs: [{ name: 'Programas', page: 'Programa' }] },
            React.createElement(AccordionVertical, { defaultExpanded: true, title: 'Programas', width: 260, expansibleColumn: React.createElement(ListPrograms, { context: context, currentUser: currentUser, programChoosed: programChoosed, refetch: refetchProgram, setFilter: setFilterProgram, filter: filterProgram, handleProgram: (program) => setProgramChoosed(program) }) },
                React.createElement(AccordionVertical, { defaultExpanded: true, title: ((_a = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ||
                        'Escolha um Programa', width: 270, expansibleColumn: React.createElement(React.Fragment, null, programChoosed ? (React.createElement(DetailProgram, { context: context, refetch: refetchTeam, programTemperature: programTemperature, isProgramResponsible: isProgramResponsible, isProgramDirector: isProgramDirector, isFinance: isFinance, refetchSchedule: refetchSchedule, refetchResource: refetchResource, programChoosed: programChoosed, teamChoosed: teamChoosed, setTeamChoosed: setTeamChoosed })) : (React.createElement(Box, { display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' },
                        React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                            React.createElement(FaAward, { color: '#0063a5', style: { fontSize: '5rem' } }),
                            React.createElement(Typography, { variant: 'h5', color: 'primary', style: { fontWeight: 'bold' } }, "Escolha um Programa"))))) }, React.createElement(React.Fragment, null, teamChoosed ? (React.createElement(Box, { marginRight: '1rem' },
                    React.createElement(DetailTeam, { currentUser: currentUser, programChoosed: programChoosed, activityChoosed: activityChoosed, setActivityChoosed: setActivityChoosed, teamTemperature: teamTemperature, programTemperature: programTemperature, isProgramResponsible: isProgramResponsible, isProgramDirector: isProgramDirector, isHeadOfService: isHeadOfService, context: context, resources: resources, schedules: schedule, listMode: listMode, handleModeView: () => setListMode(!listMode), refetchTeam: refetchTeam, refetchProgram: refetchProgram, refetchSchedule: refetchSchedule, refetchResource: refetchResource, updateSchedule: updateSchedule, teamChoosed: teamChoosed }))) : (React.createElement(Box, { display: 'flex', height: '100%', 
                    // width='55rem'
                    justifyContent: 'center', alignItems: 'center' },
                    React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                        React.createElement(FaUserFriends, { color: '#0063a5', size: '5rem' }),
                        React.createElement(Typography, { variant: 'h5', color: 'primary', style: { fontWeight: 'bold' } }, "Escolha uma turma"))))))))));
};
export default ProgramPage;
//# sourceMappingURL=ProgramPage.js.map