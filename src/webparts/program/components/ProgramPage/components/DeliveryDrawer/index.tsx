import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  SwipeableDrawer,
} from '@material-ui/core';
import * as React from 'react';
import { Add, Close } from '@material-ui/icons';
import DeliveryCard from './Delivery';
import DeliveryForm from './DeliveryForm';
import DaysWithoutDeliveryCard from './DaysWithoutDeliveryCard';
import { PREFIX } from '~/config/database';
import {
  getDeliveryByTeamId,
  updateDelivery,
} from '~/store/modules/delivery/actions';

interface DeliveryDrawerProps {
  open: boolean;
  team: any;
  onClose: () => void;
}

export const DeliveryDrawer: React.FC<DeliveryDrawerProps> = ({
  open,
  team,
  onClose,
}) => {
  const [deliveries, setDeliveries] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [deliveryChoosed, setDeliveryChoosed] = React.useState<any>();

  React.useEffect(() => {
    if (team?.[`${PREFIX}turmaid`] && open) {
      refetchDelivery();
    }
  }, [team, open]);

  // const handleCheckboxChange = (value) => {
  //   setSelectedAvailableDates((prevCheckedItems: any) => {
  //     if (prevCheckedItems.includes(value)) {
  //       return prevCheckedItems.filter((item) => item !== value);
  //     } else {
  //       return [...prevCheckedItems, value];
  //     }
  //   });
  // };

  const refetchDelivery = () => {
    setLoading(true);
    getDeliveryByTeamId(team?.[`${PREFIX}turmaid`])
      .then((data) => {
        setDeliveries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleChosenDelivery = (delivery?) => {
    setDeliveryChoosed(delivery);
    setOpenModal(true);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    refetchDelivery();
    setOpenModal(false);
  };

  const handleEditDelivery = (delivery) => {
    handleChosenDelivery(delivery);
    handleOpenModal();
  };

  const handleDeleteDelivery = (delivery) => {
    updateDelivery(
      delivery?.[`${PREFIX}entregaid`],
      { [`${PREFIX}ativo`]: false },
      {
        onSuccess: refetchDelivery,
        onError: (err) => {},
      }
    );
  };

  const daysAvailable = React.useMemo(
    () =>
      team?.[`${PREFIX}CronogramadeDia_Turma`].filter((scheduleDay) => {
        return (
          scheduleDay?.[`${PREFIX}ativo`] &&
          !deliveries?.some((del) =>
            del?.[`${PREFIX}Entrega_CronogramadeDia`].some(
              (deliveryDay) =>
                deliveryDay?.[`${PREFIX}data`] ===
                scheduleDay?.[`${PREFIX}data`]
            )
          )
        );
      }),
    [team, deliveries]
  );

  const allDaysAvailable = React.useMemo<any[]>(
    () =>
      team?.[`${PREFIX}CronogramadeDia_Turma`]?.filter(
        (e) => !e?.[`${PREFIX}excluido`] && e?.[`${PREFIX}ativo`]
      ),
    [team]
  );

  const handleClose = () => {
    onClose();
  };

  const list = () => (
    <Box
      display='flex'
      marginTop='1rem'
      alignItems='flex-start'
      flexDirection='column'
      style={{ gap: '1rem' }}
    >
      <Button
        onClick={() => handleChosenDelivery()}
        variant='contained'
        color='primary'
        startIcon={<Add />}
      >
        Adicionar Entrega
      </Button>
      {daysAvailable && (
        <Box width='100%'>
          <DaysWithoutDeliveryCard days={daysAvailable} />
        </Box>
      )}

      <Box display='flex' width='100%' flexDirection='column'>
        {loading ? (
          <CircularProgress size={20} color='primary' />
        ) : (
          deliveries?.map((delivery) => {
            return (
              <DeliveryCard
                delivery={delivery}
                onDelete={() => handleDeleteDelivery(delivery)}
                onEdit={() => handleEditDelivery(delivery)}
              />
            );
          })
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <SwipeableDrawer
        anchor={'right'}
        open={open}
        onClose={() => {}}
        onOpen={() => {}}
      >
        <IconButton
          aria-label='close'
          onClick={handleClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
        <Box width='35rem' padding='1rem'>
          {list()}
        </Box>
        <DeliveryForm
          open={openModal}
          nextDelivery={deliveries.length + 1}
          teamId={team?.[`${PREFIX}turmaid`]}
          delivery={deliveryChoosed}
          setDelivery={setDeliveryChoosed}
          daysAvailable={daysAvailable}
          allDays={allDaysAvailable}
          onClose={handleCloseModal}
        />
      </SwipeableDrawer>
    </>
  );
};
