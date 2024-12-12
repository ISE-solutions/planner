import { Card, CardContent, CardHeader, IconButton } from '@material-ui/core';
import styled from 'styled-components';

export const Title = styled.h2`
  margin: 0;
  max-width: 14rem;
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

export const StyledHeaderCard = styled(CardHeader)`
  padding: 0 10px;

  .MuiCardHeader-action {
    margin-top: 0;
  }
`;

export const StyledIconButton = styled(IconButton)`
  padding: 5px;
`;

export const StyledContentCard = styled(CardContent)`
  padding: 0 10px;
  padding-bottom: 10px !important;
`;
