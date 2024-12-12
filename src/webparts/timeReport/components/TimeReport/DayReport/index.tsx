import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import * as React from 'react';

interface DayReportProps {
  day: string;
  items: any[];
}

const DayReport: React.FC<DayReportProps> = ({ day, items }) => {
  return (
    <Box display='flex' flexDirection='column' marginTop='2rem'>
      <Typography
        style={{ fontWeight: 'bold', fontSize: '1rem', paddingBottom: '10px' }}
      >
        {day}
        {items?.[0]?.module ? ' - ' + items?.[0]?.module : ''}
      </Typography>

      <TableContainer style={{ overflow: 'hidden' }} component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell
                style={{ fontWeight: 'bold', minWidth: '85px', width: '10%' }}
              >
                Horário
              </TableCell>
              <TableCell style={{ fontWeight: 'bold', width: '20%' }}>
                Atividade
              </TableCell>
              <TableCell style={{ fontWeight: 'bold', width: '35%' }}>
                Descrição
              </TableCell>
              <TableCell style={{ fontWeight: 'bold', width: '20%' }}>
                Responsável
              </TableCell>

              <TableCell style={{ fontWeight: 'bold', width: '15%' }}>
                Local
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.time}>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {row?.documents?.map((doc) => (
                    <p style={{ fontWeight: 'bold' }}>{doc} </p>
                  ))}
                  <p style={{ textDecoration: 'underline' }}>{row.course}</p>
                  <p>{row.theme} </p>

                  <p style={{ fontStyle: 'italic' }}>{row.academicArea}</p>
                </TableCell>
                <TableCell>{row.people}</TableCell>
                <TableCell>{row.spaces}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DayReport;
