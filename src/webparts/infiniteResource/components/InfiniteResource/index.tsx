import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import InfiniteResourcePage from './InfiniteResourcePage';

interface IInfiniteResourceProps {
  context: WebPartContext;
}

const InfiniteResource: React.FC<IInfiniteResourceProps> = ({ context }) => {
  return (
    <App context={context}>
      <InfiniteResourcePage context={context} />
    </App>
  );
};

export default InfiniteResource;
