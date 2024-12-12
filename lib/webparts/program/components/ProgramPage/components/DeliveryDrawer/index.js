import { Box, Button, CircularProgress, IconButton, SwipeableDrawer, } from '@material-ui/core';
import * as React from 'react';
import { Add, Close } from '@material-ui/icons';
import DeliveryCard from './Delivery';
import DeliveryForm from './DeliveryForm';
import DaysWithoutDeliveryCard from './DaysWithoutDeliveryCard';
import { PREFIX } from '~/config/database';
import { getDeliveryByTeamId, updateDelivery, } from '~/store/modules/delivery/actions';
export const DeliveryDrawer = ({ open, team, onClose, }) => {
    const [deliveries, setDeliveries] = React.useState([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [deliveryChoosed, setDeliveryChoosed] = React.useState();
    React.useEffect(() => {
        if ((team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]) && open) {
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
        getDeliveryByTeamId(team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`])
            .then((data) => {
            setDeliveries(data);
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    };
    const handleChosenDelivery = (delivery) => {
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
        updateDelivery(delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}entregaid`], { [`${PREFIX}ativo`]: false }, {
            onSuccess: refetchDelivery,
            onError: (err) => { },
        });
    };
    const daysAvailable = React.useMemo(() => team === null || team === void 0 ? void 0 : team[`${PREFIX}CronogramadeDia_Turma`].filter((scheduleDay) => {
        return ((scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}ativo`]) &&
            !(deliveries === null || deliveries === void 0 ? void 0 : deliveries.some((del) => del === null || del === void 0 ? void 0 : del[`${PREFIX}Entrega_CronogramadeDia`].some((deliveryDay) => (deliveryDay === null || deliveryDay === void 0 ? void 0 : deliveryDay[`${PREFIX}data`]) ===
                (scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}data`])))));
    }), [team, deliveries]);
    const allDaysAvailable = React.useMemo(() => {
        var _a;
        return (_a = team === null || team === void 0 ? void 0 : team[`${PREFIX}CronogramadeDia_Turma`]) === null || _a === void 0 ? void 0 : _a.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]));
    }, [team]);
    const handleClose = () => {
        onClose();
    };
    const list = () => (React.createElement(Box, { display: 'flex', marginTop: '1rem', alignItems: 'flex-start', flexDirection: 'column', style: { gap: '1rem' } },
        React.createElement(Button, { onClick: () => handleChosenDelivery(), variant: 'contained', color: 'primary', startIcon: React.createElement(Add, null) }, "Adicionar Entrega"),
        daysAvailable && (React.createElement(Box, { width: '100%' },
            React.createElement(DaysWithoutDeliveryCard, { days: daysAvailable }))),
        React.createElement(Box, { display: 'flex', width: '100%', flexDirection: 'column' }, loading ? (React.createElement(CircularProgress, { size: 20, color: 'primary' })) : (deliveries === null || deliveries === void 0 ? void 0 : deliveries.map((delivery) => {
            return (React.createElement(DeliveryCard, { delivery: delivery, onDelete: () => handleDeleteDelivery(delivery), onEdit: () => handleEditDelivery(delivery) }));
        })))));
    return (React.createElement(React.Fragment, null,
        React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: () => { }, onOpen: () => { } },
            React.createElement(IconButton, { "aria-label": 'close', onClick: handleClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null)),
            React.createElement(Box, { width: '35rem', padding: '1rem' }, list()),
            React.createElement(DeliveryForm, { open: openModal, nextDelivery: deliveries.length + 1, teamId: team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`], delivery: deliveryChoosed, setDelivery: setDeliveryChoosed, daysAvailable: daysAvailable, allDays: allDaysAvailable, onClose: handleCloseModal }))));
};
//# sourceMappingURL=index.js.map