import * as React from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  StyledCard,
  StyledContentCard,
  StyledHeaderCard,
  StyledIconButton,
  Title,
} from './styles';
import { Add, MoreVert } from '@material-ui/icons';
import AddTeam from '~/components/AddTeam';
import { AddButton } from '../../styles';
import { PREFIX } from '~/config/database';
import { TitleCard } from '../ListPrograms/styles';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useConfirmation } from '~/hooks';
import { useDispatch } from 'react-redux';
import { deleteTeam } from '~/store/modules/team/actions';

interface IDetailProgram {
  programChoosed: any;
  canEdit: boolean;
  teamChoosed: any;
  loading: boolean;
  refetch: any;
  teams: any[];
  setSearch: any;
  context: WebPartContext;
  setTeamChoosed: React.Dispatch<any>;
}

const DetailProgram: React.FC<IDetailProgram> = ({
  programChoosed,
  setTeamChoosed,
  canEdit,
  teamChoosed,
  context,
  setSearch,
  loading,
  teams,
  refetch,
}) => {
  const [openAddTeam, setOpenAddTeam] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [itemSelected, setItemSelected] = React.useState(null);

  const { confirmation } = useConfirmation();
  const dispatch = useDispatch();

  const handleClose = () => {
    refetch?.();
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
      description: `Tem certeza que deseja excluir a Turma ${
        itemSelected?.[`${PREFIX}nome`] || itemSelected?.[`${PREFIX}titulo`]
      }?`,
      onConfirm: () => {
        dispatch(
          deleteTeam(itemSelected[`${PREFIX}turmaid`], {
            onSuccess: () => {
              refetch();
              setItemSelected(null);
              setTeamChoosed(null);
            },
            onError: () => setItemSelected(null),
          })
        );
      },
    });
  };

  return (
    <>
      <AddTeam
        isModel
        refetch={refetch}
        context={context}
        open={openAddTeam}
        team={itemSelected}
        setTeam={setItemSelected}
        teamLength={teams?.length}
        teams={teams}
        program={programChoosed}
        programId={programChoosed?.[`${PREFIX}programaid`]}
        handleClose={handleClose}
      />

      <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Tooltip
            arrow
            title={programChoosed?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]}
          >
            <Title>
              {programChoosed?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]}
            </Title>
          </Tooltip>
          {canEdit ? (
            <Tooltip arrow title='Nova Turma'>
              <AddButton
                variant='contained'
                color='primary'
                onClick={() => setOpenAddTeam(true)}
              >
                <Add />
              </AddButton>
            </Tooltip>
          ) : null}
        </Box>

        <TextField
          label='Pesquisar'
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress size={20} color='primary' />
                ) : null}
              </>
            ),
          }}
        />

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseAnchor}
        >
          <MenuItem onClick={handleDetail}>Detalhar</MenuItem>
          <MenuItem onClick={handleDeleteTeam}>Excluir</MenuItem>
        </Menu>

        {teams?.length ? (
          <>
            {teams?.map((team) => (
              <StyledCard
                elevation={3}
                active={
                  team?.[`${PREFIX}turmaid`] ===
                  teamChoosed?.[`${PREFIX}turmaid`]
                }
              >
                <StyledHeaderCard
                  action={
                    <Tooltip arrow title='Ações'>
                      <StyledIconButton
                        aria-label='settings'
                        onClick={(event) => handleOption(event, team)}
                      >
                        <MoreVert />
                      </StyledIconButton>
                    </Tooltip>
                  }
                  title={
                    <Tooltip arrow title={team?.[`${PREFIX}sigla`]}>
                      <TitleCard onClick={() => setTeamChoosed(team)}>
                        {team?.[`${PREFIX}sigla`]}
                      </TitleCard>
                    </Tooltip>
                  }
                />
                <StyledContentCard onClick={() => setTeamChoosed(team)}>
                  <Divider />
                  <Typography variant='body1'>
                    {team?.[`${PREFIX}nome`]}
                  </Typography>
                </StyledContentCard>
              </StyledCard>
            ))}
          </>
        ) : (
          <Typography
            variant='body1'
            color='textSecondary'
            style={{ fontWeight: 'bold' }}
          >
            Nenhuma turma cadastrada
          </Typography>
        )}
      </Box>
    </>
  );
};

export default DetailProgram;
