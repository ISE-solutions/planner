import * as React from 'react';
import { SwipeableDrawer } from '@material-ui/core';
import * as _ from 'lodash';
import Form from './Form';

interface IAddTeam {
  open: boolean;
  task: any;
  refetch: () => void
  setTeam?: (item) => void;
  handleClose: () => void;
}

const AddTeam: React.FC<IAddTeam> = ({ open, task,refetch, setTeam, handleClose }) => {
  const onClose = () => {
    handleClose();
  };

  return (
    <SwipeableDrawer
      anchor='right'
      open={open}
      onClose={onClose}
      onOpen={() => null}
      disableBackdropClick
    >
      <Form task={task} refetch={refetch} setTeam={setTeam} handleClose={onClose} />
    </SwipeableDrawer>
  );
};

export default AddTeam;
