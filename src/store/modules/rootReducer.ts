import { combineReducers } from 'redux';

import tag from './tag/reducer';
import app from './app/reducer';
import person from './person/reducer';
import space from './space/reducer';
import team from './team/reducer';
import program from './program/reducer';
import activity from './activity/reducer';
import resource from './resource/reducer';
import finiteInfiniteResource from './finiteInfiniteResource/reducer';
import task from './task/reducer';
import notification from './notification/reducer';
import delivery from './delivery/reducer';
import eventOutlook from './eventOutlook/reducer';
import environmentReference from './environmentReference/reducer';
import customFilter from './customFilter/reducer';
import batchEdition from './batchEdition/reducer';
import genericActions from './genericActions/reducer';

export default combineReducers({
  activity,
  tag,
  app,
  team,
  program,
  person,
  resource,
  finiteInfiniteResource,
  space,
  task,
  notification,
  delivery,
  eventOutlook,
  environmentReference,
  customFilter,
  batchEdition,
  genericActions,
});
