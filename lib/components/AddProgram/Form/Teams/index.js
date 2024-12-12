import { CircularProgress, IconButton, ListItem, ListItemSecondaryAction, ListItemText, Tooltip, Typography, } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import * as React from 'react';
import { PREFIX } from '~/config/database';
import { useConfirmation, useNotification } from '~/hooks';
import { ListStyled } from './styles';
import { useDispatch } from 'react-redux';
import { deleteTeam } from '~/store/modules/team/actions';
import { deleteByTeam } from '~/store/modules/resource/actions';
import Backdrop from '~/components/Backdrop';
const Teams = ({ teams, isDetail, isSaved, refreshProgram, handleTeam, }) => {
    var _a;
    const { confirmation } = useConfirmation();
    const { notification } = useNotification();
    const [loading, setLoading] = React.useState(false);
    const [listTeam, setListTeam] = React.useState(teams);
    React.useEffect(() => {
        setListTeam(teams);
    }, [teams]);
    const dispatch = useDispatch();
    const handleDeleteTeam = (team) => {
        confirmation.openConfirmation({
            title: 'Confirmação da ação',
            description: `Tem certeza que deseja excluir a Turma ${(team === null || team === void 0 ? void 0 : team[`${PREFIX}nome`]) || (team === null || team === void 0 ? void 0 : team[`${PREFIX}titulo`])}?`,
            onConfirm: () => {
                setLoading(true);
                dispatch(deleteTeam(team[`${PREFIX}turmaid`], {
                    onSuccess: () => {
                        setLoading(false);
                        refreshProgram === null || refreshProgram === void 0 ? void 0 : refreshProgram();
                        notification.success({
                            title: 'Sucesso',
                            description: 'excluído com sucesso!',
                        });
                    },
                    onError: () => {
                        setLoading(false);
                        notification.error({
                            title: 'Falha',
                            description: 'Houve um erro interno!',
                        });
                    },
                }));
                dispatch(deleteByTeam(team[`${PREFIX}turmaid`]));
            },
        });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Backdrop, { open: loading },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(ListStyled, null, (listTeam === null || listTeam === void 0 ? void 0 : listTeam.length) ? ((_a = listTeam === null || listTeam === void 0 ? void 0 : listTeam.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]))) === null || _a === void 0 ? void 0 : _a.map((te) => (React.createElement(ListItem, { button: true, onClick: () => handleTeam(te) },
            React.createElement(ListItemText, { primary: te === null || te === void 0 ? void 0 : te[`${PREFIX}sigla`], secondary: te === null || te === void 0 ? void 0 : te[`${PREFIX}nome`] }),
            React.createElement(ListItemSecondaryAction, null, isSaved ? (React.createElement(Tooltip, { title: 'Excluir' },
                React.createElement(IconButton, { disabled: isDetail, onClick: () => handleDeleteTeam(te) },
                    React.createElement(Delete, { color: 'primary' })))) : null))))) : (React.createElement(Typography, null, "N\u00E3o existem cronogramas cadastrados")))));
};
export default Teams;
//# sourceMappingURL=index.js.map