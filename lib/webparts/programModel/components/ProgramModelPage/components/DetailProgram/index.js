import * as React from 'react';
import { Box, CircularProgress, Divider, Menu, MenuItem, TextField, Tooltip, Typography, } from '@material-ui/core';
import { StyledCard, StyledContentCard, StyledHeaderCard, StyledIconButton, Title, } from './styles';
import { Add, MoreVert } from '@material-ui/icons';
import AddTeam from '~/components/AddTeam';
import { AddButton } from '../../styles';
import { PREFIX } from '~/config/database';
import { TitleCard } from '../ListPrograms/styles';
import { useConfirmation } from '~/hooks';
import { useDispatch } from 'react-redux';
import { deleteTeam } from '~/store/modules/team/actions';
const DetailProgram = ({ programChoosed, setTeamChoosed, canEdit, teamChoosed, context, setSearch, loading, teams, refetch, }) => {
    var _a, _b;
    const [openAddTeam, setOpenAddTeam] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [itemSelected, setItemSelected] = React.useState(null);
    const { confirmation } = useConfirmation();
    const dispatch = useDispatch();
    const handleClose = () => {
        refetch === null || refetch === void 0 ? void 0 : refetch();
        setOpenAddTeam(false);
        setItemSelected(null);
    };
    const handleCloseAnchor = () => {
        setAnchorEl(null);
    };
    const handleOption = (event, item) => {
        setItemSelected(item);
        setAnchorEl(event.currentTarget);
    };
    const handleDetail = () => {
        setOpenAddTeam(true);
        handleCloseAnchor();
    };
    const handleDeleteTeam = () => {
        handleCloseAnchor();
        confirmation.openConfirmation({
            title: 'Confirmação da ação',
            description: `Tem certeza que deseja excluir a Turma ${(itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}nome`]) || (itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}titulo`])}?`,
            onConfirm: () => {
                dispatch(deleteTeam(itemSelected[`${PREFIX}turmaid`], {
                    onSuccess: () => {
                        refetch();
                        setItemSelected(null);
                        setTeamChoosed(null);
                    },
                    onError: () => setItemSelected(null),
                }));
            },
        });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(AddTeam, { isModel: true, refetch: refetch, context: context, open: openAddTeam, team: itemSelected, setTeam: setItemSelected, teamLength: teams === null || teams === void 0 ? void 0 : teams.length, teams: teams, program: programChoosed, programId: programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}programaid`], handleClose: handleClose }),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
            React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                React.createElement(Tooltip, { arrow: true, title: (_a = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`] },
                    React.createElement(Title, null, (_b = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}NomePrograma`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`])),
                canEdit ? (React.createElement(Tooltip, { arrow: true, title: 'Nova Turma' },
                    React.createElement(AddButton, { variant: 'contained', color: 'primary', onClick: () => setOpenAddTeam(true) },
                        React.createElement(Add, null)))) : null),
            React.createElement(TextField, { label: 'Pesquisar', onChange: (e) => setSearch(e.target.value), InputProps: {
                    endAdornment: (React.createElement(React.Fragment, null, loading ? (React.createElement(CircularProgress, { size: 20, color: 'primary' })) : null)),
                } }),
            React.createElement(Menu, { anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: handleCloseAnchor },
                React.createElement(MenuItem, { onClick: handleDetail }, "Detalhar"),
                React.createElement(MenuItem, { onClick: handleDeleteTeam }, "Excluir")),
            (teams === null || teams === void 0 ? void 0 : teams.length) ? (React.createElement(React.Fragment, null, teams === null || teams === void 0 ? void 0 : teams.map((team) => (React.createElement(StyledCard, { elevation: 3, active: (team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]) ===
                    (teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`]) },
                React.createElement(StyledHeaderCard, { action: React.createElement(Tooltip, { arrow: true, title: 'A\u00E7\u00F5es' },
                        React.createElement(StyledIconButton, { "aria-label": 'settings', onClick: (event) => handleOption(event, team) },
                            React.createElement(MoreVert, null))), title: React.createElement(Tooltip, { arrow: true, title: team === null || team === void 0 ? void 0 : team[`${PREFIX}sigla`] },
                        React.createElement(TitleCard, { onClick: () => setTeamChoosed(team) }, team === null || team === void 0 ? void 0 : team[`${PREFIX}sigla`])) }),
                React.createElement(StyledContentCard, { onClick: () => setTeamChoosed(team) },
                    React.createElement(Divider, null),
                    React.createElement(Typography, { variant: 'body1' }, team === null || team === void 0 ? void 0 : team[`${PREFIX}nome`]))))))) : (React.createElement(Typography, { variant: 'body1', color: 'textSecondary', style: { fontWeight: 'bold' } }, "Nenhuma turma cadastrada")))));
};
export default DetailProgram;
//# sourceMappingURL=index.js.map