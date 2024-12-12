import * as React from 'react';
import { Dialog, AppBar, Tabs, Tab, Box } from '@material-ui/core';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
import Info from './Info';
import EnvolvedPerson from './EnvolvedPerson';
import Observation from './Observation';
import FantasyName from './FantasyName';
import styles from './ModalForm.module.scss';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

interface IModalFormProps {
  open: boolean;
  academicActivity?: any;
  refetch?: any;
  notification: NotificationActionProps;
  handleClose: () => void;
  handleEdit: (item) => void;
}

const ModalForm: React.FC<IModalFormProps> = ({
  open,
  academicActivity,
  refetch,
  notification,
  handleClose,
  handleEdit,
}) => {
  const [tab, setTab] = React.useState(0);
  const [tempTab, setTempTab] = React.useState(0);

  const onClose = () => {
    refetch();
    handleClose();
    setTab(0);
    setTempTab(0);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTempTab(newValue);
  };

  const handleChangeIndex = () => {
    setTab(tempTab);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={styles.dialogContent}
      maxWidth='md'
      fullWidth
      disableBackdropClick
    >
      <AppBar position='static' color='default'>
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
          aria-label='full width tabs example'
        >
          <Tab label='Informações' {...a11yProps(0)} />
          <Tab
            disabled={!academicActivity}
            label='Nome Fantasia'
            {...a11yProps(1)}
          />
          <Tab
            disabled={!academicActivity}
            label='Pessoas Envolvidas'
            {...a11yProps(2)}
          />
          <Tab
            disabled={!academicActivity}
            label='Observações'
            {...a11yProps(3)}
          />
        </Tabs>
      </AppBar>

      <TabPanel value={tab} index={0}>
        <Box p={3} className={styles.boxTab}>
          <Info
            tab={0}
            tempTab={tempTab}
            handleChangeIndex={handleChangeIndex}
            onResetTempTab={() => setTempTab(0)}
            academicActivity={academicActivity}
            onClose={onClose}
            handleEdit={handleEdit}
            notification={notification}
          />
        </Box>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Box p={3} className={styles.boxTab}>
          <FantasyName
            tab={1}
            tempTab={tempTab}
            handleChangeIndex={handleChangeIndex}
            onResetTempTab={() => setTempTab(1)}
            handleEdit={handleEdit}
            academicActivity={academicActivity}
            onClose={onClose}
            notification={notification}
          />
        </Box>
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Box p={3} className={styles.boxTab}>
          <EnvolvedPerson
            tab={2}
            tempTab={tempTab}
            handleChangeIndex={handleChangeIndex}
            onResetTempTab={() => setTempTab(2)}
            handleEdit={handleEdit}
            academicActivity={academicActivity}
            onClose={onClose}
            notification={notification}
          />
        </Box>
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <Box p={3} className={styles.boxTab}>
          <Observation
            tab={3}
            tempTab={tempTab}
            handleEdit={handleEdit}
            handleChangeIndex={handleChangeIndex}
            onResetTempTab={() => setTempTab(3)}
            academicActivity={academicActivity}
            notification={notification}
            onClose={onClose}
          />
        </Box>
      </TabPanel>
    </Dialog>
  );
};

export default ModalForm;
