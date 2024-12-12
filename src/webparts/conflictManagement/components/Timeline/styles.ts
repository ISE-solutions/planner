import styled from 'styled-components';
import { Backdrop } from '@material-ui/core';

export const TitleSidebar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
`;

export const BackdropStyled = styled(Backdrop)`
  z-index: 99999;
  color: #fff;
`;

export const BoxConflict = styled.div`
  color: #e57373;

  p {
    margin: 0;
  }
`;

export const SectionNamePopup = styled.strong`
  font-size: 13px;
`;

export const SectionList = styled.ul`
  padding: 10px 20px;
  margin: 0;
`;
