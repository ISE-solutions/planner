import * as React from 'react';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Box, Menu, MenuItem, Typography } from '@material-ui/core';
import { PREFIX } from '~/config/database';
import LayerDay from './LayerDay';
import CloneActivity from './CloneActivity';

interface IListDays {
  schedules: any[];
  refetchActivity: any;
  dictTag: any;
  teamChoosed: any;
  programChoosed: any;
  activities: any[];
  handleToSaveActivityModel: (activity: any) => void;
  handleActivityDetail: (activity: any) => void;
  handleOptionSchedule: (event: any, item: any) => void;
  handleDelete: (activityId: string) => void;
}

const ListDays: React.FC<IListDays> = ({
  schedules,
  refetchActivity,
  dictTag,
  teamChoosed,
  programChoosed,
  activities,
  handleDelete,
  handleToSaveActivityModel,
  handleOptionSchedule,
  handleActivityDetail,
}) => {
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

  const handleDetailActivity = (act?) => {
    handleActivityDetail(act || activityChoosed);
    handleCloseActivityAnchor();
  };

  const handleOpenCloneActivity = () => {
    setOpenCloneActivity(true);
    handleCloseActivityAnchor();
  };

  const schedulesList = React.useMemo<any[]>(
    () =>
      schedules
        ?.map((sch) => {
          let hasConflict = false;
          sch.activities = activities
            .filter((actv) => {
              const isFromDay =
                moment
                  .utc(actv?.[`${PREFIX}datahorainicio`])
                  .format('DD/MM/YYYY') ===
                moment.utc(sch?.[`${PREFIX}data`]).format('DD/MM/YYYY');

              if (isFromDay && !hasConflict && actv?.hasConflict) {
                hasConflict = true;
              }

              return isFromDay;
            })
            ?.sort(
              (a, b) =>
                moment(a?.[`${PREFIX}inicio`], 'HH:mm').unix() -
                moment(b?.[`${PREFIX}inicio`], 'HH:mm').unix()
            );

          sch.hasConflict = hasConflict;
          return sch;
        })
        ?.sort((left, right) =>
          moment
            .utc(left?.[`${PREFIX}data`])
            .diff(moment.utc(right?.[`${PREFIX}data`]))
        ),
    [schedules, activities]
  );

  return (
    <>
      <CloneActivity
        open={openCloneActivity}
        schedules={schedules}
        refetchActivity={refetchActivity}
        activity={activityChoosed}
        onClose={() => setOpenCloneActivity(false)}
      />

      <Menu
        anchorEl={anchorActivityEl}
        keepMounted
        open={Boolean(anchorActivityEl)}
        onClose={handleCloseActivityAnchor}
      >
        <MenuItem onClick={() => handleDetailActivity()}>Detalhar</MenuItem>
        <MenuItem onClick={handleOpenCloneActivity}>Clonar</MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseActivityAnchor();
            handleToSaveActivityModel(activityChoosed);
          }}
        >
          Salvar como Modelo
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseActivityAnchor();
            handleDelete(activityChoosed?.[`${PREFIX}atividadeid`]);
          }}
        >
          Excluir
        </MenuItem>
      </Menu>

      <Box display='flex' flexDirection='column' width='calc(100% - 3rem)' style={{ gap: '1rem' }}>
        <Box
          display='flex'
          overflow='auto'
          id='DayCalendarList'
          height='calc(100vh - 11rem)'
          paddingBottom='10px'
          margin='0 -5px'
          style={{ gap: '1rem' }}
        >
          {schedulesList?.length ? (
            <>
              {schedulesList?.map((sched) => (
                <LayerDay
                  schedule={sched}
                  teamId={teamChoosed?.[`${PREFIX}turmaid`]}
                  programId={teamChoosed?.[`_${PREFIX}programa_value`]}
                  refetchActivity={refetchActivity}
                  handleDetailActivity={handleDetailActivity}
                  handleSchedule={handleOptionSchedule}
                  handleOptionActivity={handleOptionActivity}
                  teamChoosed={teamChoosed}
                  programChoosed={programChoosed}
                />
              ))}
            </>
          ) : (
            <Typography variant='body1'>
              Nenhum Dia de aula cadastrado
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ListDays;
