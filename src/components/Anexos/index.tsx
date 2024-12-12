import { DeleteRounded, SaveAltRounded } from '@material-ui/icons';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
  TableBody,
  TableCell,
  TableHead,
  Table as TableMaterial,
  TableRow,
  CircularProgress,
  Button,
} from '@material-ui/core';
import * as React from 'react';

import * as _ from 'lodash';
import fileSize from './../../utils/fileSize';
import downloadFile from '../../utils/downloadFile';

const Transition = React.forwardRef((props, ref) => (
  // @ts-ignore
  <Slide direction='up' ref={ref} {...props} />
));

interface IAnexoProps {
  anexos?: any;
  label?: string;
  variant?: string;
  id?: string;
  justify?: string;
  canRemove?: boolean;
  maxLength?: number;
  maxSize?: number;
  ref: any;
  accept?: string;
  disabled?: boolean;
}

const Anexo: React.FC<IAnexoProps> = React.forwardRef(
  (
    {
      anexos,
      disabled,
      label,
      variant,
      id,
      justify,
      canRemove = true,
      accept = '*',
      maxLength,
      maxSize,
    },
    ref
  ) => {
    const [arquivos, setArquivos] = React.useState([]);
    const [modal, setModal] = React.useState({ open: false, item: {} });

    React.useImperativeHandle(ref, () => ({
      getAnexos() {
        return arquivos;
      },
    }));

    React.useEffect(() => {
      setArquivos(anexos || []);
    }, [anexos]);

    const addAnexo = (event) => {
      let newFiles = _.cloneDeep(arquivos);

      if (
        maxLength &&
        newFiles.filter((e) => !e.deveExcluir).length >= maxLength
      ) {
        return;
      }

      const { files } = event.target;
      // @ts-ignore
      Array.from(files).forEach((file: any) => {
        if (!(maxSize && file.size > maxSize)) {
          newFiles.push({ nome: file.name, tamanho: file.size, file: file });
        }
      });

      setArquivos(newFiles);
    };

    const confirmDelete = (item) => {
      setModal({ ...modal, open: true, item });
    };

    const handleClose = () => {
      setModal({ open: false, item: {} });
    };

    const deleteAnexo = (index) => {
      let anexos = _.cloneDeep(arquivos);
      anexos[index].deveExcluir = true;

      setArquivos(anexos);
      handleClose();
    };

    const downloadAnexo = (item, index) => {
      let anexos = _.cloneDeep(arquivos);
      anexos[index].loading = true;
      setArquivos(anexos);

      downloadFile(item.relativeLink, item.nome).then(() => {
        let anexos = _.cloneDeep(arquivos);
        anexos[index].loading = false;
        setArquivos(anexos);
      });
    };

    return (
      <Grid
        ref={ref}
        key={id}
        // @ts-ignore
        justify={justify || 'center'}
        direction='column'
        container
        spacing={2}
      >
        {arquivos.length ? (
          <Grid item style={{ width: '100%' }}>
            <TableMaterial size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Tamanho</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {arquivos?.map((item, index) => (
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
                        {!item.deveExcluir && canRemove && !disabled && (
                          <Grid item>
                            <DeleteRounded
                              onClick={() =>
                                confirmDelete({ nome: item.nome, index: index })
                              }
                              style={{ color: '#33485d', cursor: 'pointer' }}
                            />
                          </Grid>
                        )}
                        {item.relativeLink && (
                          <Grid item>
                            {item.loading ? (
                              <CircularProgress
                                size={20}
                                style={{ color: '#33485d' }}
                              />
                            ) : (
                              <SaveAltRounded
                                onClick={() => downloadAnexo(item, index)}
                                style={{ color: '#33485d', cursor: 'pointer' }}
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
          </Grid>
        ) : null}

        <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            color='primary'
            // @ts-ignore
            variant={variant || 'contained'}
            disabled={
              disabled ||
              (maxLength &&
                arquivos.filter((e) => !e.deveExcluir).length >= maxLength)
            }
            onClick={() => document.getElementById(`btn-anexo-${id}`).click()}
          >
            {label || 'Adicionar Anexo'}
            <input
              onChange={addAnexo}
              id={`btn-anexo-${id}`}
              type='file'
              accept={accept}
              multiple
              style={{ display: 'none' }}
            />
          </Button>
        </Grid>

        <Dialog
          open={modal.open}
          // @ts-ignore
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
        >
          <DialogTitle>Tem Certeza que deseja excluir o arquivo?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {
                //@ts-ignore
                modal.item.nome
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Não</Button>

            <Button
              variant='contained'
              color='primary'
              // @ts-ignore
              onClick={() => deleteAnexo(modal.item.index)}
            >
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
);

export default Anexo;
