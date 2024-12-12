import styled from 'styled-components';
import newShade from '~/utils/newShade';
const backgroundCard = (background, active) => {
    if (background) {
        return active ? newShade(background, -80) : background;
    }
    return active ? '#29aff8' : '#d5effd';
};
export const WrapperTitle = styled.div `
  background: ${({ background, active }) => backgroundCard(background, active)};
  color: ${({ color }) => color || '#fff'};
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    width: 100%;

    h5 {
      font-weight: bold;
      margin: 0;
      padding: 0.5rem;
      font-size: 1rem;
      text-align: center;
    }

    > span {
      font-weight: bold;
      margin: 0;
      padding: 0.5rem;
      font-size: 0.8rem;
    }
  }

  * {
    font-family: Source Sans Pro, sans-serif, 'Segoe UI',
      'Segoe UI Web (West European)', BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol';
  }
`;
//# sourceMappingURL=styles.js.map