import * as React from 'react';
import { SwipeableDrawer } from '@material-ui/core';
import ActivityForm from './../ActivityForm';
const EditActivityForm = ({ open, team, program, isModel, isDraft, activity, refetch, undoNextActivities, isProgramResponsible, isProgramDirector, academicDirector, throwToApprove, setActivity, onClose, onSave, }) => {
    return (React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: onClose, onOpen: () => null, disableBackdropClick: true },
        React.createElement(ActivityForm, { isDrawer: true, team: team, refetch: refetch, program: program, isModel: isModel, isDraft: isDraft, undoNextActivities: undoNextActivities, isProgramResponsible: isProgramResponsible, academicDirector: academicDirector, setActivity: setActivity, throwToApprove: throwToApprove, handleClose: onClose, activity: activity, onSave: onSave })));
};
export default EditActivityForm;
//# sourceMappingURL=index.js.map