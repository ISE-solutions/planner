import * as React from 'react';
import { Box, ClickAwayListener, IconButton, Tooltip, withStyles, } from '@material-ui/core';
import { Close, HelpOutline } from '@material-ui/icons';
const StyledTooltip = withStyles({
    tooltip: {
        backgroundColor: 'rgba(40, 40, 40, 0.9)',
        minWidth: '31rem',
        overflow: 'auto',
        maxHeight: '90vh',
    },
})(Tooltip);
const HelperTooltip = ({ content }) => {
    const [tooltipOpen, setTooltipOpen] = React.useState(false);
    return (React.createElement(ClickAwayListener, { onClickAway: () => setTooltipOpen(false) },
        React.createElement(StyledTooltip, { PopperProps: {
                style: {
                    pointerEvents: 'all',
                },
            }, open: tooltipOpen, onClose: () => setTooltipOpen(false), disableFocusListener: true, disableHoverListener: true, disableTouchListener: true, title: React.createElement(Box, { position: 'relative' },
                React.createElement("div", { dangerouslySetInnerHTML: {
                        __html: content,
                    }, style: {
                        marginRight: '30px',
                    } }),
                React.createElement(Box, { style: { position: 'absolute', right: 3, top: 3 } },
                    React.createElement(Close, { onClick: () => setTooltipOpen(false) }))) },
            React.createElement(IconButton, { onClick: () => setTooltipOpen(!tooltipOpen) },
                React.createElement(HelpOutline, null)))));
};
export default HelperTooltip;
//# sourceMappingURL=index.js.map