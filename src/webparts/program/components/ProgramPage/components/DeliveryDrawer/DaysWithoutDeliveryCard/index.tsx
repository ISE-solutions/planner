import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Box, Chip } from '@material-ui/core';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';

interface DaysWithoutDeliveryCardProps {
  days: any[];
}
const DaysWithoutDeliveryCard: React.FC<DaysWithoutDeliveryCardProps> = ({
  days,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography color='primary' style={{ fontWeight: 'bold' }}>
          Dias sem entregas
        </Typography>
        <Box display='flex' style={{ gap: '10px' }} flexWrap='wrap'>
          {days.map((day) => {
            return (
              <Chip
                label={moment.utc(day?.[`${PREFIX}data`]).format('DD/MM/YYYY')}
              />
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DaysWithoutDeliveryCard;
