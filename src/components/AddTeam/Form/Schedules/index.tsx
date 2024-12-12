import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import * as moment from 'moment';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { PREFIX } from '~/config/database';
import { useConfirmation, useNotification, useScheduleDay } from '~/hooks';
import { ListStyled } from './styles';

interface ISchedulesProps {
  schedules: any[];
  isModel: boolean;
  isLoadModel: boolean;
  isDetail: boolean;
  isSaved: boolean;
  removeDaySchedule: (scheduleId: string) => void;
  getActivityByTeamId: (teamId: string) => Promise<any>;
  handleSchedule: (sche: any) => void;
  refetch: any;
}

const Schedules: React.FC<ISchedulesProps> = ({
  schedules,
  isDetail,
  refetch,
  isLoadModel,
  isSaved,
  isModel,
  handleSchedule,
  removeDaySchedule,
  getActivityByTeamId,
}) => {
  const [{ desactiveSchedule }] = useScheduleDay({}, {});
  const { confirmation } = useConfirmation();
  const { notification } = useNotification();
  const [listSchedule, setListSchedule] = React.useState(schedules);
  const itemsPerPage = 5;
  const [hasMore, setHasMore] = React.useState(true);
  const [records, setRecords] = React.useState(
    Math.min(itemsPerPage, listSchedule?.length || 0)
  );

  React.useEffect(() => {
    setListSchedule(
      schedules?.sort((left, right) =>
        moment
          .utc(left?.[`${PREFIX}data`])
          .diff(moment.utc(right?.[`${PREFIX}data`]))
      )
    );
  }, [schedules]);

  const handleDelete = async (item: any) => {
    if (isLoadModel) {
      removeDaySchedule(item?.keyid);
      const indexSchedule = listSchedule.findIndex(
        (e) => e?.keyid === item?.keyid
      );
      const newSchedule = [...listSchedule];
      newSchedule.splice(indexSchedule, 1);
      setListSchedule(newSchedule);
      notification.success({
        title: 'Sucesso',
        description: 'Excluído realizado com sucesso',
      });
      return;
    }
    const activities = await getActivityByTeamId(
      item?.[`_${PREFIX}turma_value`]
    );

    desactiveSchedule(
      item?.[`${PREFIX}cronogramadediaid`],
      activities?.value.map((e) => e?.[`${PREFIX}atividadeid`]),
      {
        onSuccess: () => {
          refetch?.();
          const indexSchedule = listSchedule.findIndex(
            (e) =>
              e?.[`${PREFIX}cronogramadediaid`] ===
              item?.[`${PREFIX}cronogramadediaid`]
          );
          const newSchedule = [...listSchedule];
          newSchedule.splice(indexSchedule, 1);
          setListSchedule(newSchedule);
          notification.success({
            title: 'Sucesso',
            description: 'Excluído realizado com sucesso',
          });
        },
        onError: (error) =>
          notification.success({
            title: 'Falha',
            description: error?.data?.error?.message,
          }),
      }
    );
  };

  const handleConfirmation = (item: any) => {
    confirmation.openConfirmation({
      title: 'Excluir horário',
      description: 'Deseja excluir o cronograma?',
      onConfirm: () => handleDelete(item),
    });
  };

  const showItems = (schedules) => {
    var items = [];
    for (var i = 0; i < records; i++) {
      let sch = schedules[i];
      items.push(
        <ListItem button onClick={() => handleSchedule(sch)}>
          <ListItemText
            primary={moment
              .utc(sch?.[`${PREFIX}data`])
              .format(isModel ? 'DD/MM' : 'DD/MM/YYYY')}
            secondary={sch?.[`${PREFIX}nome`]}
          />
          <ListItemSecondaryAction>
            {isSaved ? (
              <Tooltip title='Excluir'>
                <IconButton
                  disabled={isDetail}
                  onClick={() => handleConfirmation(sch)}
                >
                  <Delete color='primary' />
                </IconButton>
              </Tooltip>
            ) : null}
          </ListItemSecondaryAction>
        </ListItem>
      );
    }
    return items;
  };

  const loadMore = () => {
    if (records >= listSchedule?.length) {
      setHasMore(false);
    } else {
      setTimeout(() => {
        const newQuantity = records + itemsPerPage;
        setRecords(Math.min(newQuantity, listSchedule?.length));
      }, 300);
    }
  };

  return (
    <ListStyled>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={<Typography>Não existem cronogramas cadastrados</Typography>}
        useWindow={false}
      >
        {showItems(listSchedule)}
      </InfiniteScroll>
    </ListStyled>
  );
};

export default Schedules;
