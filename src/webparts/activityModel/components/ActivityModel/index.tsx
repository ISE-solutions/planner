import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ActivityModelPage from './ActivityModelPage';

interface IActivityModel {
  context: WebPartContext;
}

const ActivityModel: React.FC<IActivityModel> = ({ context }) => {
  return (
    <App context={context}>
      <ActivityModelPage context={context} />
    </App>
  );
};

export default ActivityModel;
