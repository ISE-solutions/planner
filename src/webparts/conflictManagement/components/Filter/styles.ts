import { Box } from '@material-ui/core';
import { DateCalendar } from '@mui/x-date-pickers';
import styled from 'styled-components';

export const Title = styled.h2`
  margin: 0;
`;

export const WrapperDatePicker = styled(Box)`
  p {
    font-weight: bold;
  }

  .mbsc-textfield-wrapper-outline {
    margin: 0 !important;
  }
`;

export const DateCalendarStyled = styled(DateCalendar)`
  width: 280px !important;
  margin: -0.2rem !important;

  .MuiPickersCalendarHeader-root {
    padding-left: 12px !important;
  }
`;
