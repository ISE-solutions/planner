import { Card, CardHeader, IconButton, Typography } from '@material-ui/core';
import styled from 'styled-components';

export const TitleCard = styled(Typography)`
  max-width: 10rem;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 1.2em;
  white-space: nowrap;
  line-height: 1;
`;

export const StyledCard = styled(Card)`
  border-radius: 10px;
  background-color: ${({ active }) => (active ? '#29aff8' : '#d5effd')};
`;

export const StyledIconButton = styled(IconButton)`
  padding: 5px;
`;

export const StyledHeaderCard = styled(CardHeader)`
  padding: 0 10px;

  .MuiCardHeader-action {
    margin-top: 0;
  }
`;

export const BoxActivityName = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 15rem;
`;
