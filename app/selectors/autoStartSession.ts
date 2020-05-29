import { get as _get } from 'lodash';
import { IStoreState } from 'src/client/types/store-state';
import isOwner from 'src/client/app/selectors/isOwner';
import clientContainer from 'src/ioc/ioc-client';
import { IAppConfig } from 'src/ioc/ioc-interfaces';
import { TYPES } from 'src/ioc/TYPES';

// is user owner of the room
// @param {IApp} state - app state
export default (state: IStoreState) => {
  return (
    clientContainer.get<IAppConfig>(TYPES.Config).clientConfig.autoStartOnDemandSession &&
    isOwner(state) &&
    _get(state, 'room.state.id') !== _get(state, 'auth.user.roomId')
  ); // not permanent room
};
