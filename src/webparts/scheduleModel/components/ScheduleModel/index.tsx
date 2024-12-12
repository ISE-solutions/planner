import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ScheduleModelPage from './ScheduleModelPage';

interface IScheduleModel {
  context: WebPartContext;
}

const ScheduleModel: React.FC<IScheduleModel> = ({ context }) => {
  return (
    <App context={context}>
      <ScheduleModelPage context={context} />
    </App>
  );
};

export default ScheduleModel;
