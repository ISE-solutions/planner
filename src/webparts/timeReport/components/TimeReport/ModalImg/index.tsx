import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { PREFIX } from '~/config/database';
import { AppState } from '~/store';
import { useSelector } from 'react-redux';

interface IModalImgProps {
  open: boolean;
  onClose: () => void;
  generatePDF: (data: any) => void;
  language: {
    value: string;
    label: string;
  };
  setLanguage: React.Dispatch<
    React.SetStateAction<{
      value: string;
      label: string;
    }>
  >;
}

const ModalImg: React.FC<IModalImgProps> = ({
  onClose,
  generatePDF,
  language,
  setLanguage,
  open,
}) => {
  const [leftImg, setLeftImg] = React.useState('');
  const [rightImg, setRightImg] = React.useState('');
  const [centerImg, setCenterImg] = React.useState('');
  const [defaultImg, setDefaultImg] = React.useState<any>(0);

  const { app } = useSelector((state: AppState) => state);
  const { images, context } = app;

  const loadSharepointImage = (img) => {
    if (!img) return null;

    if (img.serverRelativeUrl) {
      return `${img.serverUrl}${img.serverRelativeUrl}`;
    }
    return `${context.pageContext.web.absoluteUrl}/Lists/Imagens/Attachments/${defaultImg}/${img.fileName}`;
  };

  async function convertImageToBase64(imageUrl): Promise<string> {
    const response = await fetch(imageUrl);

    const blob = await response.blob();

    // Create a promise to convert the blob to Base64 using FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // @ts-ignore
        resolve(reader.result); // reader.result is the Base64 string
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Converts blob to Base64 data URL
    });
  }

  const handleGenerate = async () => {
    let left = leftImg;
    let right = rightImg;
    let center = centerImg;

    if (defaultImg) {
      const imgChoosed = images?.find((e) => e.Id === defaultImg);

      left = await convertImageToBase64(
        loadSharepointImage(JSON.parse(imgChoosed?.Esquerda))
      );
      right = await convertImageToBase64(
        loadSharepointImage(JSON.parse(imgChoosed?.Direita))
      );
      center = await convertImageToBase64(
        loadSharepointImage(JSON.parse(imgChoosed?.Centro))
      );
    }

    generatePDF({
      leftImg: left,
      rightImg: right,
      centerImg: center,
      language,
    });
    onClose();
    setLeftImg('');
    setRightImg('');
    setCenterImg('');
  };

  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      cb(reader.result);
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  };

  const handleImg = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImg: React.Dispatch<React.SetStateAction<string>>
  ) => {
    getBase64(event.target.files[0], setImg);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Escolha as imagens</DialogTitle>
      <DialogContent>
        <Box
          display='flex'
          width='100%'
          flexDirection='column'
          alignItems='center'
          style={{ gap: '1rem' }}
        >
          <Autocomplete
            fullWidth
            filterSelectedOptions={true}
            options={[
              {
                value: `${PREFIX}nome`,
                label: 'Português',
              },
              {
                value: `${PREFIX}nomeen`,
                label: 'Inglês',
              },
              {
                value: `${PREFIX}nomees`,
                label: 'Espanhol',
              },
            ]}
            noOptionsText='Sem Opções'
            value={language}
            onChange={(event: any, newValue: any) => setLanguage(newValue)}
            getOptionSelected={(option: any, item: any) =>
              option?.value === item?.value
            }
            getOptionLabel={(option: any) => option?.label || ''}
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Idioma' />
            )}
          />

          <Box display='flex' width='100%' justifyContent='space-between'>
            <FormControl component='fieldset'>
              <RadioGroup
                value={defaultImg}
                onChange={(e) => setDefaultImg(+e.target.value)}
              >
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  label='Customizado'
                />

                {images?.map((im) => (
                  <FormControlLabel
                    value={im.Id}
                    control={<Radio />}
                    label={im.Title}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {!defaultImg ? (
              <Box display='flex' alignItems='center' style={{ gap: '15px' }}>
                <Box
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                  style={{ gap: '15px' }}
                >
                  <input
                    accept='image/png,  image/jpeg'
                    style={{ display: 'none' }}
                    id='leftImg'
                    type='file'
                    onChange={(event) => handleImg(event, setLeftImg)}
                  />
                  <label htmlFor='leftImg'>
                    <Button
                      variant='contained'
                      color='primary'
                      component='span'
                    >
                      Esquerda
                    </Button>
                  </label>

                  {leftImg && (
                    <img src={leftImg} width='120px' alt='Esquerda' />
                  )}
                </Box>

                <Box
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                  style={{ gap: '15px' }}
                >
                  <input
                    accept='image/png,  image/jpeg'
                    style={{ display: 'none' }}
                    id='centerImg'
                    type='file'
                    onChange={(event) => handleImg(event, setCenterImg)}
                  />
                  <label htmlFor='centerImg'>
                    <Button
                      variant='contained'
                      color='primary'
                      component='span'
                    >
                      Centro
                    </Button>
                  </label>

                  {centerImg && (
                    <img src={centerImg} width='120px' alt='Centro' />
                  )}
                </Box>

                <Box
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                  style={{ gap: '15px' }}
                >
                  <input
                    accept='image/png,  image/jpeg'
                    style={{ display: 'none' }}
                    id='rightImg'
                    type='file'
                    onChange={(event) => handleImg(event, setRightImg)}
                  />
                  <label htmlFor='rightImg'>
                    <Button
                      variant='contained'
                      color='primary'
                      component='span'
                    >
                      Direita
                    </Button>
                  </label>
                  {rightImg && (
                    <img src={rightImg} width='120px' alt='Direita' />
                  )}
                </Box>
              </Box>
            ) : null}
          </Box>
        </Box>
        {/* <TextField
          autoFocus
          onChange={(event) => setLeftImg(event.target.value)}
          label='Imagem lado direito (url)'
          type='url'
          fullWidth
        />

        <TextField
          onChange={(event) => setRightImg(event.target.value)}
          label='Imagem lado esquerda (url)'
          type='url'
          fullWidth
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancelar
        </Button>
        <Button onClick={handleGenerate} variant='contained' color='primary'>
          Gerar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalImg;
