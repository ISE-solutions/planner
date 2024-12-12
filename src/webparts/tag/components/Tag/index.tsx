import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import TagPage from './TagPage';

interface ITagProps {
  context: WebPartContext;
}

const Tag: React.FC<ITagProps> = ({ context }) => {
  return (
    <App context={context}>
      <TagPage context={context} />
    </App>
  );
};

export default Tag;
