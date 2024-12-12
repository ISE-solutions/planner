import * as React from 'react';
import * as _ from 'lodash';
import { Box, FormControl, FormHelperText, TextField } from '@material-ui/core';

interface IObservationProps {
  formik: any;
}

const Observation: React.FC<IObservationProps> = ({ formik }) => {
  return (
    <>
      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        <FormControl fullWidth>
          <TextField
            fullWidth
            multiline
            minRows={3}
            inputProps={{ maxLength: 2000 }}
            type='text'
            name='description'
            onChange={(nextValue) =>
              formik.setFieldValue('description', nextValue.target.value)
            }
            value={formik.values.description}
          />
          <FormHelperText>
            {formik?.values?.description?.length || 0}/2000
          </FormHelperText>
        </FormControl>
      </Box>
    </>
  );
};

export default Observation;
