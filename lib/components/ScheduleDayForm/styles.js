import { Card, CardActionArea } from '@material-ui/core';
import styled from 'styled-components';
export const OptionCard = styled(Card) `
  border-radius: 10px;
  min-height: 10rem;
  min-width: 10rem;
  border: solid 1px #0063a5;
`;
export const StyledCardActionArea = styled(CardActionArea) `
  display: flex;
  padding: 1rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 10rem;

  p {
    font-weight: bold;
  }
`;
export const BoxCloseIcon = styled.div `
  position: absolute;
  right: 10px;
  top: 10px;
`;
//# sourceMappingURL=styles.js.map