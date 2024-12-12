import { Box, Typography } from '@material-ui/core';
import { Block } from '@material-ui/icons';
import * as React from 'react';

const DontHasPermition: React.FC = () => {
  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Typography variant='h4'>Você não possui permissão</Typography>

      <Block style={{ fontSize: '3rem' }} />
      <Typography variant='body1'>
        Procure o administrador da aplicação
      </Typography>
    </Box>
  );
};

export default DontHasPermition;
