import _get from 'lodash/get';
import { entities } from 'src/ioc/ioc-client';
import { UserColors } from 'src/client/types/app';
import { IStoreState } from 'src/client/types/store-state';

let latestUserColors: any = null;
let latestUserColorsState: any = null;

export default (state: IStoreState): UserColors => {
  const userColors = _get(state, 'room.state.userColors');

  if (userColors !== latestUserColorsState) {
    latestUserColorsState = userColors;

    latestUserColors = {
      ...latestUserColorsState,
      default: entities.defaultTheme.buttonDisabledColor,
    };
  }

  return latestUserColors;
};
