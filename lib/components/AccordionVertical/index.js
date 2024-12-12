import * as React from 'react';
import clsx from 'clsx';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { Box, Drawer } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { StyledIconButton, Title } from './styles';
const AccordionVertical = ({ width: drawerWidth, defaultExpanded, title, widthClosed, children, expansibleColumn, }) => {
    const [open, setOpen] = React.useState(defaultExpanded);
    const useStyles = makeStyles((theme) => createStyles({
        drawer: {
            width: drawerWidth,
            margin: '0 1rem',
            height: '100%',
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            left: 'auto',
            position: 'relative',
            overflowY: 'initial',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            left: 'auto',
            position: 'relative',
            overflowY: 'initial',
            width: widthClosed || '69px',
        },
        drawerPaper: {
            paddingRight: '1rem',
        },
    }));
    const handleDrawer = () => {
        setOpen(!open);
    };
    const classes = useStyles();
    return (React.createElement(Box, { display: 'flex', width: '100%', height: '100%' },
        React.createElement(Drawer, { variant: 'permanent', className: clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            }), classes: {
                paper: clsx(classes.drawerPaper, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }, anchor: 'left' },
            React.createElement(Box, { position: 'absolute', right: '-.9rem', top: '1.3rem', zIndex: 9999 },
                React.createElement(StyledIconButton, { onClick: handleDrawer }, open ? (React.createElement(FaAngleLeft, { color: '#0063a5' })) : (React.createElement(FaAngleRight, { color: '#0063a5' })))),
            React.createElement(Box, { height: '100%' }, open ? (expansibleColumn) : (React.createElement(Box, { display: 'flex', justifyContent: 'center', marginTop: '2rem' },
                React.createElement(Title, null, title))))),
        React.createElement(Box, { width: open ? `calc(100% - ${drawerWidth + 30}px)` : `calc(100% - 80px)` }, children)));
};
export default AccordionVertical;
//# sourceMappingURL=index.js.map