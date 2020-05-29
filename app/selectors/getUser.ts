import { get as _get } from 'lodash';
import { IAuthUser } from 'ioc/ioc-interfaces';
import { IStoreState } from 'src/client/types/store-state';

export default (state: IStoreState): IAuthUser => {
  return _get(state, 'auth.user', null);
};
