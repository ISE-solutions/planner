import * as React from 'react';
import { Grid } from '@material-ui/core';

const ItemValue = ({ title, value, column, line }: any) => {
  if (title) {
    return (
      <Grid
        container
        alignItems='center'
        style={{
          alignItems: 'baseline',
          marginTop: line ? '1em' : 0,
          padding: '5px 0',
        }}
        id='box-value'
      >
        <Grid
          item
          xs={column ? 12 : 5}
          md={column ? 12 : 5}
          style={{
            color: '#2A2A2A',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          {title}
        </Grid>
        <Grid
          style={{
            wordWrap: 'break-word',
            color: '#2A2A2A',
            textAlign: 'justify',
            alignItems: 'center',
            fontSize: '14px',
            display: line ? 'block' : 'flex',
            width: line ? '100%' : 'auto',
            whiteSpace: 'pre-line',
          }}
          item
        >
          {value}
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid
        style={{
          wordWrap: 'break-word',
          color: '#2A2A2A',
          textAlign: 'justify',
          display: 'block',
          width: '100%',
        }}
        item
        id='box-only-value'
      >
        {value}
      </Grid>
    );
  }
};

export default ItemValue;
