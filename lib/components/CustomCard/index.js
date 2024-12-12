import { Button, Card, CardContent, CardHeader, IconButton, Typography, } from '@material-ui/core';
import styled from 'styled-components';
import newShade from '~/utils/newShade';
export const Title = styled.h4 `
  margin: 0;
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const TitleCard = styled(Typography) `
  max-width: 10rem;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 1.2em;
  white-space: nowrap;
  line-height: 1;
`;
const backgroundCard = (background, active) => {
    if (background) {
        return active ? newShade(background, -80) : background;
    }
    return active ? '#29aff8' : '#d5effd';
};
export const StyledCard = styled(Card) `
  border-radius: 10px;
  background: ${({ background, active }) => backgroundCard(background, active)};
  color: ${({ color }) => color || '#fff'};
  min-height: 5.5rem;
  margin: 0 5px;

  cursor: pointer;
  ${({ active }) => active &&
    `hr {
      background: ${({ color }) => color || '#fff'};
    }
    * {
      color: ${({ color }) => color || '#fff'};
    }`}

  :hover {
    background-color: ${({ background }) => background ? newShade(background, -10) : '#29aff8'};
    hr {
      background: ${({ color }) => color || '#fff'};
    }
    * {
      color: ${({ color }) => color || '#fff'};
    }
  }
`;
export const StyledIconButton = styled(IconButton) `
  padding: 5px;
`;
export const StyledHeaderCard = styled(CardHeader) `
  padding: 0 10px;

  .MuiCardHeader-action {
    margin-top: 0;
  }
`;
export const StyledContentCard = styled(CardContent) `
  padding: 0 10px;
  padding-bottom: 10px !important;

  p {
    max-width: 13rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
export const AddButton = styled(Button) `
  border-radius: 50%;
  padding: 5px 5px;
`;
//# sourceMappingURL=index.js.map