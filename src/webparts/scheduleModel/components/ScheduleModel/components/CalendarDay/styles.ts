import { Backdrop } from '@material-ui/core';
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

export const BackdropStyled = styled(Backdrop)`
  z-index: 99999;
  color: #fff;
`;
