var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EActionType } from './types';
import { setValue } from '../common';
import { sp } from '@pnp/sp';
export const setContext = (context) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.SET_CONTEXT, context));
});
export const setCurrentUser = (currentUser) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.SET_CURRENT_USER, currentUser));
});
export const fetchTooltips = () => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const _tooltip = sp.web.lists.getByTitle('Tooltip');
    _tooltip.items
        .get()
        .then((data) => dispatch(setValue(EActionType.FETCH_TOOLTIP_SUCCESS, data)));
});
export const fetchImages = () => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const _images = sp.web.lists.getByTitle('Imagens');
    _images.items
        .get()
        .then((data) => dispatch(setValue(EActionType.FETCH_IMAGES_SUCCESS, data)));
});
//# sourceMappingURL=actions.js.map