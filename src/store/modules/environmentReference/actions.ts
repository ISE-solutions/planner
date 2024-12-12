import api from '~/services/api';
import * as _ from 'lodash';
import { ENVIRONMENT_REFERENCE } from '~/config/database';
import { Dispatch } from 'react';
import { EActionType } from './types';
import { setValue } from '../common';

export const fetchAllEnvironmentReference =
  (): any => async (dispatch: Dispatch<any>) => {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
      const { data } = await api.get(`${ENVIRONMENT_REFERENCE}`);

      dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data?.value));
    } catch (error) {
      console.error(error);
    }
  };
