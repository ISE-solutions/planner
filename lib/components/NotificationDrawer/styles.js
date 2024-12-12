import styled from 'styled-components';
import { Card, Typography } from '@material-ui/core';
const textWidthValue = '600px';
const textNotificationHoverOpacityValue = '0.9, 0.8, 0.7';
export const ListDrawer = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
export const TextNotification = styled.div `
  max-width: ${textWidthValue};

  &:hover {
    background-color: #e6e6e6;
    opacity: ${textNotificationHoverOpacityValue};
  }
`;
export const StyledListItem = styled.div `
  width: 100%;
`;
export const StyledCard = styled(Card) `
  min-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  box-shadow: none;
`;
export const StyledTitle = styled(Typography) `
  font-weight: bold;
  font-size: 15px;
  text-align: center;
`;
//# sourceMappingURL=styles.js.map