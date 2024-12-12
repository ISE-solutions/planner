import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import TrashPage from './TrashPage';

interface ITrashProps {
  context: WebPartContext;
}

const Trash: React.FC<ITrashProps> = ({ context }) => {
  return (
    <App context={context}>
      <TrashPage context={context} />
    </App>
  );
};

export default Trash;
