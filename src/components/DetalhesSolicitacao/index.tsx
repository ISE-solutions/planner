import * as _ from 'lodash';
import * as React from 'react';
import {
  CircularProgress,
  Grid,
  Paper,
  Table as TableMaterial,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import fileSize from '../../utils/fileSize';
import ItemValue from './ItemValue';
import { SaveAltRounded } from '@material-ui/icons';
import downloadFile from '../../utils/downloadFile';

const DetalhesSolicitacao = ({
  children,
  solicitacao,
  hideHistory,
  print,
}: any) => {
  const { items, anexos, assinatura } = solicitacao;

  const downloadAnexo = (item, index) => {
    downloadFile(item.relativeLink, item.nome);
  };

  return (
    <Paper elevation={0}>
      {(items || []).map((item, index) => {
        return (
          !item.hide && (
            <div key={index} style={{ marginTop: '1em' }}>
              <span
                style={{
                  color: '#2A2A2A',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  padding: '1rem',
                  textTransform: 'uppercase',
                }}
              >
                {item.title}
              </span>
              <Grid
                style={{
                  border: '1px solid #0063a5',
                  padding: '1em',
                  marginTop: '.8rem',
                }}
                container
                justify='space-between'
              >
                {Array.isArray(item?.coluna1) ? (
                  <React.Fragment>
                    <Grid
                      item
                      xs={print ? 6 : 12}
                      sm={print ? 6 : 12}
                      md={6}
                      lg={6}
                    >
                      {item?.coluna1?.map((col, indexCol) => {
                        return (
                          !col.hide && (
                            <ItemValue
                              key={indexCol}
                              title={col?.title}
                              value={col?.value}
                            />
                          )
                        );
                      })}
                    </Grid>
                    <Grid
                      item
                      xs={print ? 6 : 12}
                      sm={print ? 6 : 12}
                      md={6}
                      lg={6}
                    >
                      {item?.coluna2?.map((col, indexCol) => {
                        return (
                          !col.hide && (
                            <ItemValue
                              key={indexCol}
                              title={col?.title}
                              value={col?.value}
                            />
                          )
                        );
                      })}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginTop: '6px' }}
                    >
                      {(item?.linha || []).map((col, indexCol) => {
                        return (
                          !col.hide && (
                            <ItemValue
                              line
                              style={{ marginTop: '1em' }}
                              key={indexCol}
                              column
                              title={col?.title}
                              value={col?.value}
                            />
                          )
                        );
                      })}
                    </Grid>
                  </React.Fragment>
                ) : item?.coluna1?.items ? (
                  <React.Fragment>
                    <Grid
                      item
                      xs={print ? 6 : 12}
                      sm={print ? 6 : 12}
                      md={6}
                      lg={6}
                    >
                      <Grid
                        item
                        style={{
                          color: '#A2A2A2',
                          fontWeight: 'bold',
                        }}
                      >
                        {item?.coluna1 && item?.coluna1?.title}
                      </Grid>
                      {item?.coluna1?.items.map((col, indexCol) => {
                        return (
                          !col.hide && (
                            <ItemValue key={indexCol} value={col?.value} />
                          )
                        );
                      })}
                    </Grid>

                    <Grid
                      item
                      xs={print ? 6 : 12}
                      sm={print ? 6 : 12}
                      md={6}
                      lg={6}
                    >
                      <Grid
                        item
                        style={{
                          color: '#A2A2A2',
                          fontWeight: 'bold',
                        }}
                      >
                        {item.coluna2 && item.coluna2.title}
                      </Grid>
                      {item?.coluna2 &&
                        item?.coluna2?.items.map((col, indexCol) => {
                          return (
                            !col.hide && (
                              <ItemValue key={indexCol} value={col?.value} />
                            )
                          );
                        })}
                    </Grid>
                  </React.Fragment>
                ) : (
                  <Grid
                    item
                    style={{
                      wordWrap: 'break-word',
                      color: '#A2A2A2',
                      textAlign: 'justify',
                      display: 'block',
                      width: '100%',
                      marginTop: '1em',
                    }}
                  >
                    {item?.coluna1?.value}
                  </Grid>
                )}

                {item?.custom ? (
                  <>{print && item.hidePrint ? null : item.custom()}</>
                ) : null}
                {item?.cards ? (
                  <Grid container spacing={2} justify='space-between'>
                    {item.cards.map((card) => (
                      <Grid
                        item
                        style={{
                          width: '15em',
                          marginBottom: '2em',
                          border: `${card.color} solid 1px`,
                          padding: '1em',
                          color: card.fontColor || '#A2A2A2',
                          background: card.background,
                          boxShadow: '3px 10px 25px -16px rgba(0,0,0,0.75)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {card.value}
                        </span>
                        <p>{card.label}</p>
                      </Grid>
                    ))}
                  </Grid>
                ) : null}

                {item.table ? (
                  <Grid
                    item
                    style={{
                      color: '#A2A2A2',
                      display: 'block',
                      width: '100%',
                      overflow: 'auto',
                    }}
                  >
                    <>
                      <TableMaterial size={item.table.size || 'small'}>
                        <TableHead>
                          <TableRow>
                            {item?.table?.columns.map((e) => (
                              <TableCell
                                key={e.key}
                                style={
                                  item.table.border && {
                                    border: '1px solid #6D6D6D',
                                  }
                                }
                              >
                                {e.title}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {item?.table?.rows?.map((row) => (
                            <TableRow key={index}>
                              {item.table.columns.map(({ key, type }) => (
                                <TableCell
                                  style={
                                    item.table.border && {
                                      border: '1px solid #6D6D6D',
                                    }
                                  }
                                >
                                  {_.get(row, key)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </TableMaterial>
                      {item.table.footer ? (
                        <div
                          style={{
                            justifyContent: item.table.footer.align || 'center',
                            padding: '1em',
                            display: 'flex',
                          }}
                        >
                          {item.table.footer.value}
                        </div>
                      ) : null}
                    </>
                  </Grid>
                ) : null}
              </Grid>
            </div>
          )
        );
      })}

      <Grid container>{children}</Grid>

      {assinatura && print ? (
        <div style={{ marginTop: '1em' }}>
          <span
            style={{
              color: '#0063a5',
              fontSize: '14px',
              textTransform: 'uppercase',
            }}
          >
            {assinatura && assinatura.title}
          </span>
          <Grid
            style={{ border: '1px solid #0063a5', padding: '1em', margin: 0 }}
            container
            justify='space-between'
          >
            {assinatura.items.map((e) => (
              <Grid
                item
                style={{
                  width: `${100 / assinatura.items.length}%`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  paddingBottom: 0,
                  marginTop: '2em',
                  paddingRight: '1em',
                }}
              >
                <div
                  style={{ borderBottom: '2px solid #0063a5', width: '100%' }}
                />
                <span style={{ color: '#A2A2A2', fontWeight: 'bold' }}>
                  {e.title}
                </span>
              </Grid>
            ))}
          </Grid>
        </div>
      ) : null}

      {!print && anexos && anexos?.length ? (
        <div style={{ marginTop: '1em', textAlign: 'center' }}>
          <span
            style={{
              color: '#0063a5',
              fontSize: '14px',
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            Anexos
          </span>
          <TableMaterial size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Tamanho</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {anexos.map((item, index) => (
                <TableRow
                  style={item.deveExcluir && { backgroundColor: '#e0e0e0' }}
                  key={index}
                >
                  <TableCell style={item.deveExcluir && { color: '#6C6C6C' }}>
                    {item.nome}
                  </TableCell>
                  <TableCell style={item.deveExcluir && { color: '#6C6C6C' }}>
                    {fileSize(item.tamanho)}
                  </TableCell>
                  <TableCell>
                    <Grid
                      container
                      spacing={1}
                      style={{ flexWrap: 'nowrap' }}
                      justify='flex-start'
                    >
                      {item.relativeLink && (
                        <Grid item>
                          {item.loading ? (
                            <CircularProgress
                              size={20}
                              style={{ color: '#0063a5' }}
                            />
                          ) : (
                            <SaveAltRounded
                              onClick={() => downloadAnexo(item, index)}
                              style={{ color: '#0063a5', cursor: 'pointer' }}
                            />
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableMaterial>
        </div>
      ) : null}
    </Paper>
  );
};

export default DetalhesSolicitacao;
