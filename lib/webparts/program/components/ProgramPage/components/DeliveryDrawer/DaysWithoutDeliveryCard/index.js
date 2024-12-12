import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Box, Chip } from '@material-ui/core';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
const DaysWithoutDeliveryCard = ({ days, }) => {
    return (React.createElement(Card, null,
        React.createElement(CardContent, null,
            React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Dias sem entregas"),
            React.createElement(Box, { display: 'flex', style: { gap: '10px' }, flexWrap: 'wrap' }, days.map((day) => {
                return (React.createElement(Chip, { label: moment.utc(day === null || day === void 0 ? void 0 : day[`${PREFIX}data`]).format('DD/MM/YYYY') }));
            })))));
};
export default DaysWithoutDeliveryCard;
//# sourceMappingURL=index.js.map