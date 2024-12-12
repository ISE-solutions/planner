import * as React from 'react';
import {
  Box,
  ClickAwayListener,
  IconButton,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import { Close, HelpOutline } from '@material-ui/icons';

interface HelperTooltipProps {
  content: string;
}

const StyledTooltip = withStyles({
  tooltip: {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    minWidth: '31rem',
    overflow: 'auto',
    maxHeight: '90vh',
  },
})(Tooltip);

const HelperTooltip: React.FC<HelperTooltipProps> = ({ content }) => {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  return (
    <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
      <StyledTooltip
        PopperProps={{
          style: {
            pointerEvents: 'all',
          },
        }}
        open={tooltipOpen}
        onClose={() => setTooltipOpen(false)}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={
          <Box position='relative'>
            <div
              dangerouslySetInnerHTML={{
                __html: content,
              }}
              style={{
                marginRight: '30px',
              }}
            />
            <Box style={{ position: 'absolute', right: 3, top: 3 }}>
              <Close onClick={() => setTooltipOpen(false)} />
            </Box>
          </Box>
        }
      >
        <IconButton onClick={() => setTooltipOpen(!tooltipOpen)}>
          <HelpOutline />
        </IconButton>
      </StyledTooltip>
    </ClickAwayListener>
  );
};

export default HelperTooltip;
