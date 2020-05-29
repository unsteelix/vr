import { get as _get } from 'lodash';
import { IStoreState } from 'src/client/types/store-state';

// is user guest
// @param {IApp} state - app state
export default (state: IStoreState) => {
  return Boolean(_get(state, 'auth.user.guest'));
};
