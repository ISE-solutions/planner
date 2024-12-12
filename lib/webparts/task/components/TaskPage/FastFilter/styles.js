import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import styled from 'styled-components';
export const StyledToggleButtonGroup = styled(ToggleButtonGroup) `
  .MuiToggleButtonGroup-groupedHorizontal:not(:first-child) {
    border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
  }
`;
export const StyledToggleButton = styled(ToggleButton) `
  font-size: 10px;
  padding: 5px;
  font-weight: normal;
  background-color: transparent !important;
  border: none !important;

  &.Mui-selected {
    color: #0063a5;
    font-weight: bold;
  }
`;
//# sourceMappingURL=styles.js.map