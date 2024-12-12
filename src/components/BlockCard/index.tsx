import * as React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
} from '@material-ui/core';
import { ArrowForward, MoreHoriz } from '@material-ui/icons';
import styles from './BlockCard.module.scss';

const BlockCard: React.FC = () => {
  const colors = ['#a4dfff', '#89ccd3', '#a3eadd', '#89d3b1', '#9ff6b5'];
  const [indeColor, setIndexColor] = React.useState(
    Math.floor(Math.random() * colors.length)
  );

  return (
    <Card
      style={{
        backgroundColor: colors[indeColor],
      }}
      className={styles.card}
    >
      <CardHeader
        action={
          <IconButton aria-label='settings'>
            <MoreHoriz />
          </IconButton>
        }
        title={
          <Typography variant='body1' color='textPrimary'>
            Turma 1
          </Typography>
        }
      />
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions className={styles.cardActions}>
        <IconButton onClick={() => window.location.href = 'https://fivedevlab.sharepoint.com/sites/ip2/SitePages/Turma.aspx'}>
          <ArrowForward />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default BlockCard;
