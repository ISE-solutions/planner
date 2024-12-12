import * as React from 'react';
import { BoxDay, DeliveryContainer, DeliveryDayContainer, StyledIconButton, } from './styles';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Divider, Chip, } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Event, Edit, Delete } from '@material-ui/icons';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import { useConfirmation } from '~/hooks';
const deliveryDays = [
    {
        label: 'Grande Final',
        name: `${PREFIX}gradefinal`,
    },
    {
        label: 'Outlines',
        name: `${PREFIX}outlines`,
    },
    {
        label: 'Horários',
        name: `${PREFIX}horarios`,
    },
    {
        label: 'Aprovação',
        name: `${PREFIX}aprovacao`,
    },
    {
        label: 'Moodle/Pasta',
        name: `${PREFIX}moodlepasta`,
    },
    {
        label: 'Conferir Moodle',
        name: `${PREFIX}conferirmoodle`,
    },
];
const DeliveryCard = ({ delivery, onEdit, onDelete, }) => {
    var _a;
    const { confirmation } = useConfirmation();
    const handleDelete = () => {
        confirmation.openConfirmation({
            title: 'Confirmação de exclusão',
            description: 'Deseja realmente excluir essa entrega?',
            yesLabel: 'Sim',
            noLabel: 'Não',
            onConfirm: onDelete,
            onCancel: () => { },
        });
    };
    return (React.createElement(Accordion, null,
        React.createElement(Box, { sx: { display: 'flex' } },
            React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMoreIcon, null), style: { flex: 1 }, "aria-controls": 'panel1a-content', id: 'panel1a-header' },
                React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}titulo`])),
            React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '4px' },
                React.createElement(StyledIconButton, null,
                    React.createElement(Edit, { fontSize: 'small', onClick: onEdit })),
                React.createElement(StyledIconButton, null,
                    React.createElement(Delete, { fontSize: 'small', onClick: handleDelete })))),
        React.createElement(AccordionDetails, null,
            React.createElement(DeliveryContainer, null,
                React.createElement(Typography, null, "Dias das Entregas"),
                React.createElement(Box, { marginBottom: '1rem', display: 'flex', style: { gap: '10px' }, flexWrap: 'wrap' }, (_a = delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}Entrega_CronogramadeDia`]) === null || _a === void 0 ? void 0 : _a.map((day) => {
                    return (React.createElement(Chip, { label: moment.utc(day === null || day === void 0 ? void 0 : day[`${PREFIX}data`]).format('DD/MM/YYYY'), color: 'primary' }));
                })),
                React.createElement(Divider, { style: { margin: '10px 0' } }),
                React.createElement(Box, { display: 'flex', width: '100%', padding: '1rem', flexDirection: 'column', style: { gap: '10px' } }, deliveryDays.map((da) => (React.createElement(BoxDay, null,
                    React.createElement(Typography, null, da.label),
                    React.createElement(DeliveryDayContainer, null,
                        React.createElement(Event, { fontSize: 'small' }),
                        React.createElement(Typography, { variant: 'body1' }, moment(delivery === null || delivery === void 0 ? void 0 : delivery[da.name]).format('DD/MM/YYYY')))))))))));
};
export default DeliveryCard;
//# sourceMappingURL=index.js.map