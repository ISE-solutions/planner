import * as React from 'react';
import { Tooltip } from '@material-ui/core';
import { InfoOutlined, HelpOutline } from '@material-ui/icons';

interface IIConHelpTooltipProps {
  title: string;
}

const IconHelpTooltip: React.FC<IIConHelpTooltipProps> = ({ title }) => (
  <Tooltip title={title} arrow>
    <InfoOutlined style={{ fontSize: '20px' }} color='primary' />
  </Tooltip>
);

export default IconHelpTooltip;
