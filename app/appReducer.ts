import { IApp } from '../types/app';
import { Action, AnyAction, Reducer } from 'redux';
import INITIAL_STATE from './appState';
import { IAppConfig } from 'src/client/types/IAppConfig';
import { types } from './appActionCreators';
import commonContainer from 'src/ioc/ioc-common';
import { IAppActionTypes } from 'src/ioc/ioc-interfaces';
import { TYPES } from 'src/ioc/TYPES';

const appActionTypes = commonContainer.get<IAppActionTypes>(TYPES.ActionTypes);

const reducers: Record<string, Reducer<IApp>> = {
  [types.ROOM_TOGGLE_LEFT_PANEL_VISIBILITY](state: IApp) {
    return {
      ...state,
      view: {
        ...state.view,
        room: {
          ...state.view.room,
          isLeftPanelVisible: !state.view.room.isLeftPanelVisible,
        },
      },
    };
  },
  [types.ROOM_TOGGLE_RIGHT_PANEL_VISIBILITY](state: IApp) {
    return {
      ...state,
      view: {
        ...state.view,
        room: {
          ...state.view.room,
          isRightPanelVisible: !state.view.room.isRightPanelVisible,
        },
      },
    };
  },
  ['WEBRTC_SESSION_ENDED'](state: IApp) {
    return {
      ...state,
      view: {
        ...state.view,
        room: {
          ...state.view.room,
          isSessionJustEnded: true,
        },
      },
    };
  },
  [appActionTypes.ROOM_LEAVE](state: IApp) {
    return {
      ...state,
      view: {
        ...state.view,
        room: {
          ...state.view.room,
          isSessionJustEnded: false,
        },
      },
    };
  },
  [appActionTypes.ROOM_JOIN](state: IApp) {
    return {
      ...state,
      view: {
        ...state.view,
        room: {
          ...state.view.room,
          isSessionJustEnded: false,
        },
      },
    };
  },
  [types.SETTINGS_PANEL_CHANGE_TAB](state: IApp, action: AnyAction) {
    return {
      ...state,
      view: {
        ...state.view,
        settingsPanel: {
          ...state.view.settingsPanel,
          currentTab: action.tab,
        },
      },
    };
  },
  [types.MODAL_DIALOG_SHOW](state: IApp, action: AnyAction) {
    return {
      ...state,
      view: {
        ...state.view,
        modalDialog: action.modal,
      },
    };
  },
  [types.MODAL_DIALOG_HIDE](state: IApp, action: AnyAction) {
    return {
      ...state,
      view: {
        ...state.view,
        modalDialog: null,
      },
    };
  },
  [types.WEBRTC_SERVICE_CHANGE](state: IApp, action: AnyAction) {
    return {
      ...state,
      webrtcConfig: {
        ...state.webrtcConfig,
        selectedServiceInx: action.inx,
      },
    };
  },
};

export default (config: IAppConfig) => {
  // modify initial state by incoming params
  const initState = {
    ...INITIAL_STATE,
    recordingConfig: config.recording,
  };

  // redefine default webrtc service
  initState.webrtcConfig.selectedServiceInx = initState.webrtcConfig.services.reduce((inx, item, num) => {
    if (item.name === config.webrtc.default) {
      return num;
    }

    return inx;
  }, initState.webrtcConfig.selectedServiceInx);

  initState.webrtcConfig.defaultServiceInx = initState.webrtcConfig.selectedServiceInx;

  // return common app reducer
  return (state: IApp = initState, action: Action) => {
    if (reducers[action.type]) {
      return reducers[action.type](state, action);
    }

    return state;
  };
};
