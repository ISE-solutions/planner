import * as React from 'react';
import clsx from 'clsx';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { Box, Drawer, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { StyledIconButton, Title } from './styles';

interface IAccordionVerticalRight {
  width: number;
  title: string;
  ref?: any;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  expansibleColumn: React.ReactNode;
}

const AccordionVerticalRight: React.FC<IAccordionVerticalRight> = ({
  width: drawerWidth,
  defaultExpanded,
  title,
  children,
  expansibleColumn,
}) => {
  const [open, setOpen] = React.useState(defaultExpanded);

  const firstRender = React.useRef(true);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setOpen(true);
  }, [defaultExpanded]);

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      drawer: {
        width: drawerWidth,
        margin: '0 1rem',
        height: '100%',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      },
      drawerOpen: {
        width: drawerWidth,
        right: 'auto',
        position: 'relative',
        overflowY: 'initial',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawerClose: {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.leavingScreen,
        }),
        right: 'auto',
        position: 'relative',
        overflowY: 'initial',
        width: '69px',
      },
      drawerPaper: {
        paddingLeft: '1rem',
      },
    })
  );

  const handleDrawer = () => {
    setOpen(!open);
  };

  const classes = useStyles();

  return (
    <Box display='flex' width='100%' height='100%'>
      <Box
        width={
          open ? `calc(100% - ${drawerWidth + 40}px)` : `calc(100% - 80px)`
        }
      >
        {children}
      </Box>

      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        anchor='right'
      >
        <Box height='100%'>
          {open ? (
            expansibleColumn
          ) : (
            <Box display='flex' justifyContent='center' marginTop='2rem'>
              <Title>{title}</Title>
            </Box>
          )}
        </Box>
        <Box position='absolute' left='-.9rem' top='1.3rem' zIndex={9999}>
          <StyledIconButton onClick={handleDrawer}>
            {open ? (
              <FaAngleRight color='#0063a5' />
            ) : (
              <FaAngleLeft color='#0063a5' />
            )}
          </StyledIconButton>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AccordionVerticalRight;
