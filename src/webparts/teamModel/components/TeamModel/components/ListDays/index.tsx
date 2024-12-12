import * as React from 'react';
import {
  Box,
  Divider,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  AddButton,
  StyledCard,
  StyledContentCard,
  StyledHeaderCard,
  StyledIconButton,
  Title,
  TitleCard,
} from '~/components/CustomCard';
import { Add, MoreVert } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import * as moment from 'moment';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { deleteSchedule } from '~/store/modules/schedule/actions';
import { useConfirmation } from '~/hooks';
import { useDispatch } from 'react-redux';

interface IListDays {
  canEdit: boolean;
  schedules: any[];
  scheduleChoosed: any;
  teamChoosed: any;
  context: WebPartContext;
  refetch: any;
  handleSchedule: (schedule: any) => any;
}

const ListDays: React.FC<IListDays> = ({
  schedules,
  canEdit,
  context,
  teamChoosed,
  scheduleChoosed,
  refetch,
  handleSchedule,
}) => {
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
        .utc(itemSelected?.[`${PREFIX}data`])
        .format('DD/MM')}?`,
      onConfirm: () => {
        dispatch(
          deleteSchedule(itemSelected[`${PREFIX}cronogramadediaid`], [], {
            onSuccess: refetch,
            onError: () => null,
          })
        );
      },
    });
  };

  const schedulesList = React.useMemo<any[]>(
    () =>
      schedules?.sort((left, right) =>
        moment
          .utc(left?.[`${PREFIX}data`])
          .diff(moment.utc(right?.[`${PREFIX}data`]))
      ),
    [schedules]
  );

  return (
    <>
      <ScheduleDayForm
        isModel={true}
        titleRequired={false}
        visible={visible}
        context={context}
        schedule={itemSelected}
        team={teamChoosed}
        setSchedule={(sch) => setItemSelected(sch)}
        teamId={teamChoosed?.[`${PREFIX}turmaid`]}
        handleClose={handleClose}
      />
      <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Title>Dias</Title>
          {canEdit ? (
            <Tooltip arrow title='Novo Programa'>
              <AddButton
                variant='contained'
                color='primary'
                onClick={() => setVisible(true)}
              >
                <Add />
              </AddButton>
            </Tooltip>
          ) : null}
        </Box>

        <TextField
          label='Pesquisar'
          InputProps={{
            endAdornment: <></>,
          }}
          // onChange={(e) => setSearch(e.target.value)}
        />

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseAnchor}
        >
          <MenuItem onClick={handleDetail}>Detalhar</MenuItem>
          <MenuItem onClick={handleDeleteSchedule}>Excluir</MenuItem>
        </Menu>

        <Box
          display='flex'
          flexDirection='column'
          overflow='auto'
          maxHeight='calc(100vh - 17rem)'
          paddingBottom='10px'
          margin='0 -5px'
          style={{ gap: '1rem' }}
        >
          {schedulesList?.length ? (
            <>
              {schedulesList?.map((schedule) => (
                <StyledCard
                  key={schedule?.[`${PREFIX}cronogramadediaid`]}
                  active={
                    scheduleChoosed?.[`${PREFIX}cronogramadediaid`] ===
                    schedule?.[`${PREFIX}cronogramadediaid`]
                  }
                  elevation={3}
                >
                  <StyledHeaderCard
                    action={
                      <Tooltip arrow title='Ações'>
                        <StyledIconButton
                          aria-label='settings'
                          onClick={(event) => handleOption(event, schedule)}
                        >
                          <MoreVert />
                        </StyledIconButton>
                      </Tooltip>
                    }
                    title={
                      <Tooltip
                        arrow
                        title={schedule?.[`${PREFIX}nome`] || 'Sem informações'}
                      >
                        <TitleCard onClick={() => handleSchedule(schedule)}>
                          {schedule?.[`${PREFIX}nome`]}
                        </TitleCard>
                      </Tooltip>
                    }
                  />
                  <StyledContentCard onClick={() => handleSchedule(schedule)}>
                    <Divider />
                    <Typography variant='body1'>
                      {moment.utc(schedule?.[`${PREFIX}data`]).format('DD/MM')}
                    </Typography>
                    <Typography variant='body2'>
                      {schedule?.[`${PREFIX}Modulo`]?.[`${PREFIX}nome`]}
                    </Typography>
                  </StyledContentCard>
                </StyledCard>
              ))}
            </>
          ) : (
            <Typography variant='body1'>Nenhum dia cadastrado</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ListDays;
