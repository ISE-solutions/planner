import * as React from 'react';
import { SwipeableDrawer } from '@material-ui/core';
import ActivityForm from './../ActivityForm';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IEditActivityForm {
  open: boolean;
  isModel?: boolean;
  team?: any;
  program?: any;
  isProgramResponsible?: boolean;
  isProgramDirector?: boolean;
  isDraft?: boolean;
  activity: any;
  refetch?: any;
  undoNextActivities?: any[];
  academicDirector?: any;
  onClose: () => void;
  onSave: (item, onSuccess?: () => void) => void;
  setActivity: (item) => void;
  throwToApprove?: (item) => void;
}

const EditActivityForm: React.FC<IEditActivityForm> = ({
  open,
  team,
  program,
  isModel,
  isDraft,
  activity,
  refetch,
  undoNextActivities,
  isProgramResponsible,
  isProgramDirector,
  academicDirector,
  throwToApprove,
  setActivity,
  onClose,
  onSave,
}) => {
  return (
    <SwipeableDrawer
      anchor='right'
      open={open}
      onClose={onClose}
      onOpen={() => null}
      disableBackdropClick
    >
      <ActivityForm
        isDrawer
        team={team}
        refetch={refetch}
        program={program}
        isModel={isModel}
        isDraft={isDraft}
        undoNextActivities={undoNextActivities}
        isProgramResponsible={isProgramResponsible}
        academicDirector={academicDirector}
        setActivity={setActivity}
        throwToApprove={throwToApprove}
        handleClose={onClose}
        activity={activity}
        onSave={onSave}
      />
    </SwipeableDrawer>
  );
};

export default EditActivityForm;
