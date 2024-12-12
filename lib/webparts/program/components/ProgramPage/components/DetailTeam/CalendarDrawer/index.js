import * as React from 'react';
import { Box, IconButton, SwipeableDrawer, Typography, } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Eventcalendar, localePtBR, setOptions } from '@mobiscroll/react';
import styles from '../DetailTeam.module.scss';
import { PREFIX } from '~/config/database';
setOptions({
    locale: localePtBR,
    theme: 'ios',
    themeVariant: 'light',
});
const CalendarDrawer = ({ open, schedule, onClose, onEventHoverIn, onEventHoverOut, onItemChange, onEventClick, }) => {
    return (React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: onClose, onOpen: () => null, disableBackdropClick: true },
        React.createElement(Box, { position: 'absolute', right: '10px', top: '10px' },
            React.createElement(IconButton, { onClick: onClose },
                React.createElement(Close, null))),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', padding: '2rem', minWidth: '30rem' },
            React.createElement(Box, { display: 'flex', paddingRight: '2rem' },
                React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, "Calend\u00E1rio"))),
        React.createElement(Box, { maxWidth: '50rem' },
            React.createElement(Eventcalendar, { dragToMove: true, dragToResize: true, allDayText: 'M\u00F3dulo', width: '100%', height: '85vh', firstDay: 0, locale: localePtBR, selectedDate: schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}data`], data: (schedule === null || schedule === void 0 ? void 0 : schedule.activities) || [], view: {
                    schedule: {
                        type: 'day',
                        timeCellStep: 60,
                        timeLabelStep: 60,
                    },
                }, renderHeader: () => (React.createElement(Box, { width: '100%', display: 'flex', justifyContent: 'center' }, "Atividades")), cssClass: styles.calendar, onEventHoverIn: onEventHoverIn, onEventHoverOut: onEventHoverOut, onEventUpdate: onItemChange, onEventClick: onEventClick }))));
};
export default CalendarDrawer;
//# sourceMappingURL=index.js.map