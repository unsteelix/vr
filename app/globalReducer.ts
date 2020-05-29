import _merge from 'lodash/merge';
import { AnyAction, Reducer } from 'redux';
import { IApp } from 'src/client/types/app';
import { IAppActionTypes } from 'src/ioc/ioc-interfaces';

const globalReducer = (subReducer: Reducer, actionTypes: Partial<IAppActionTypes>) => {
  return (state: IApp, action: AnyAction) => {
    switch (action.type) {
      case actionTypes.ROOM_SET_INFO:
        // ... set partial room state from server
        return _merge(state, action.roomState);
      case actionTypes.SET_ROOM:
        // ... set room state from server
        return {
          ...action.roomState,
        };
      case actionTypes.LOGOUT: // reset room state
        state = undefined;
      default:
        return subReducer(state, action);
    }
  };
};

export default globalReducer;
