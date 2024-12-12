import * as React from 'react';
import {
  Box,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Eventcalendar, localePtBR, setOptions } from '@mobiscroll/react';
import styles from '../DetailTeam.module.scss';
import { PREFIX } from '~/config/database';

setOptions({
  locale: localePtBR,
  theme: 'ios',
  themeVariant: 'light',
});

interface CalendarDrawerProps {
  open: boolean;
  schedule: any;
  onClose: () => void;
  onEventHoverIn: (args: any) => void;
  onEventHoverOut: () => void;
  onItemChange: (args: any, inst: any) => void;
  onEventClick: (args: any) => void;
}

const CalendarDrawer: React.FC<CalendarDrawerProps> = ({
  open,
  schedule,
  onClose,
  onEventHoverIn,
  onEventHoverOut,
  onItemChange,
  onEventClick,
}) => {
  return (
    <SwipeableDrawer
      anchor='right'
      open={open}
      onClose={onClose}
      onOpen={() => null}
      disableBackdropClick
    >
      <Box position='absolute' right='10px' top='10px'>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Box
        display='flex'
        flexDirection='column'
        padding='2rem'
        minWidth='30rem'
      >
        <Box display='flex' paddingRight='2rem'>
          <Typography
            variant='h6'
            color='textPrimary'
            style={{ fontWeight: 'bold' }}
          >
            Calendário
          </Typography>
        </Box>
      </Box>

      <Box maxWidth='50rem'>
        <Eventcalendar
          dragToMove
          dragToResize
          allDayText='Módulo'
          width='100%'
          height='85vh'
          firstDay={0}
          locale={localePtBR}
          selectedDate={schedule?.[`${PREFIX}data`]}
          data={schedule?.activities || []}
          view={{
            schedule: {
              type: 'day',
              timeCellStep: 60,
              timeLabelStep: 60,
            },
          }}
          renderHeader={() => (
            <Box width='100%' display='flex' justifyContent='center'>
              Atividades
            </Box>
          )}
          cssClass={styles.calendar}
          onEventHoverIn={onEventHoverIn}
          onEventHoverOut={onEventHoverOut}
          onEventUpdate={onItemChange}
          onEventClick={onEventClick}
        />
      </Box>
    </SwipeableDrawer>
  );
};

export default CalendarDrawer;
