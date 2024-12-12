import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import * as React from 'react';
import { PREFIX } from '~/config/database';
import { useConfirmation, useNotification } from '~/hooks';
import { ListStyled } from './styles';
import { useDispatch } from 'react-redux';
import { deleteTeam } from '~/store/modules/team/actions';
import { deleteByTeam } from '~/store/modules/resource/actions';
import Backdrop from '~/components/Backdrop';

interface ITeamsProps {
  teams: any[];
  isDetail: boolean;
  isSaved: boolean;
  refreshProgram: () => void;
  handleTeam: (team: any) => void;
}

const Teams: React.FC<ITeamsProps> = ({
  teams,
  isDetail,
  isSaved,
  refreshProgram,
  handleTeam,
}) => {
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
      description: `Tem certeza que deseja excluir a Turma ${
        team?.[`${PREFIX}nome`] || team?.[`${PREFIX}titulo`]
      }?`,
      onConfirm: () => {
        setLoading(true);
        dispatch(
          deleteTeam(team[`${PREFIX}turmaid`], {
            onSuccess: () => {
              setLoading(false);
              refreshProgram?.();
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
          })
        );
        dispatch(deleteByTeam(team[`${PREFIX}turmaid`]));
      },
    });
  };

  return (
    <>
      <Backdrop open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <ListStyled>
        {listTeam?.length ? (
          listTeam
            ?.filter((e) => !e?.[`${PREFIX}excluido`] && e?.[`${PREFIX}ativo`])
            ?.map((te) => (
              <ListItem button onClick={() => handleTeam(te)}>
                <ListItemText
                  primary={te?.[`${PREFIX}sigla`]}
                  secondary={te?.[`${PREFIX}nome`]}
                />
                <ListItemSecondaryAction>
                  {isSaved ? (
                    <Tooltip title='Excluir'>
                      <IconButton
                        disabled={isDetail}
                        onClick={() => handleDeleteTeam(te)}
                      >
                        <Delete color='primary' />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </ListItemSecondaryAction>
              </ListItem>
            ))
        ) : (
          <Typography>Não existem cronogramas cadastrados</Typography>
        )}
      </ListStyled>
    </>
  );
};

export default Teams;
