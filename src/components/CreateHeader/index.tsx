import * as React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import styles from './CreateHeader.module.scss';

interface ICreateHeader {
  title: string;
  action: React.ReactNode;
}

const CreateHeader: React.FC<ICreateHeader> = ({ title, action }) => {
  return (
    <Paper elevation={3} className={styles.wrapperHeader}>
      <Grid container justify='space-between'>
        <Grid item sm={8} md={8} lg={8} xl={8}>
          <Typography variant='h6'>{title}</Typography>
        </Grid>

        <Grid item sm={4} md={4} lg={4} xl={4} className={styles.wrapperAction}>
          {action}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreateHeader;
