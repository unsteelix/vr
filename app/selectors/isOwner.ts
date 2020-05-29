import { get as _get } from 'lodash';
import { IStoreState } from 'src/client/types/store-state';

// is user owner of the room
// @param {IApp} state - app state
export default (state: IStoreState) => {
  return _get(state, 'auth.user.id') === _get(state, 'room.state.ownerId');
};
