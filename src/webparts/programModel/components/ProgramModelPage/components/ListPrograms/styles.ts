import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';

export const Title = styled.h2`
  margin: 0;
`;

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
  min-height: 5.5rem;
  margin: 0 5px;

  cursor: pointer;
  ${({ active }) =>
    active &&
    `hr {
      background: #fff;
    }
    * {
      color: #fff;
    }`}

  :hover {
    background-color: #29aff8;
    hr {
      background: #fff;
    }
    * {
      color: #fff;
    }
  }
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

export const StyledContentCard = styled(CardContent)`
  padding: 0 10px;
  padding-bottom: 10px !important;
`;
