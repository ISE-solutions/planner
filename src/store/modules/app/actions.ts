import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';

export const setContext =
  (context: WebPartContext): any =>
  async (dispatch: Dispatch<any>) => {
    dispatch(setValue(EActionType.SET_CONTEXT, context));
  };

export const setCurrentUser =
  (currentUser: any): any =>
  async (dispatch: Dispatch<any>) => {
    dispatch(setValue(EActionType.SET_CURRENT_USER, currentUser));
  };

export const fetchTooltips = (): any => async (dispatch: Dispatch<any>) => {
  const _tooltip = sp.web.lists.getByTitle('Tooltip');
  _tooltip.items
    .get()
    .then((data) =>
      dispatch(setValue(EActionType.FETCH_TOOLTIP_SUCCESS, data))
    );
};

export const fetchImages = (): any => async (dispatch: Dispatch<any>) => {
  const _images = sp.web.lists.getByTitle('Imagens');
  _images.items
    .get()
    .then((data) =>
      dispatch(setValue(EActionType.FETCH_IMAGES_SUCCESS, data))
    );
};
