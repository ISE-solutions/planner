import * as React from 'react';
import { SwipeableDrawer } from '@material-ui/core';
import Form from './Form';
const AddTeam = ({ open, task, refetch, setTeam, handleClose }) => {
    const onClose = () => {
        handleClose();
    };
    return (React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: onClose, onOpen: () => null, disableBackdropClick: true },
        React.createElement(Form, { task: task, refetch: refetch, setTeam: setTeam, handleClose: onClose })));
};
export default AddTeam;
//# sourceMappingURL=index.js.map