import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import TaskPage from './TaskPage';

interface ITaskProps {
  context: WebPartContext;
}

const Task: React.FC<ITaskProps> = ({ context }) => {
  return (
    <App context={context}>
      <TaskPage context={context} />
    </App>
  );
};

export default Task;
