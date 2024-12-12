import { Backdrop } from '@material-ui/core';
import styled from 'styled-components';

export const BackdropStyled = styled(Backdrop)`
  z-index: 99999;
  color: #fff;
`;

export const TitleResource = styled.h5`
  font-weight: bold;
  margin: 0;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
`;

export const BoxDay = styled.div`
  ${({ hasInfo }) =>
    hasInfo &&
    `background: #29aff8; 
    color: #fff;
    font-weight: bold;
    border-radius: 10px;
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;`};
`;

export const SectionNamePopup = styled.strong`
  font-size: 13px;
`;

export const SectionList = styled.ul`
  padding: 10px 20px;
  margin: 0;
`;
