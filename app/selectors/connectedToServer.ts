import { get as _get } from 'lodash';
import { IStoreState } from 'src/client/types/store-state';
import commonContainer, { IAppConstants } from 'src/ioc/ioc-common';
import { TYPES } from 'src/ioc/TYPES';

// is app connected to server
// @param {IApp} state - app state
export default (state: IStoreState) => {
  const constants = commonContainer.get<IAppConstants>(TYPES.Constants);

  return _get(state, 'connection.status') === constants.connection.CONNECTION_STATUS.CONNECTED;
};
