import { TYPES } from 'src/ioc/TYPES';
import { IAppActionCreators } from 'src/ioc/ioc-interfaces';
import { commonContainer } from 'src/ioc/ioc-common';
import { IAppModalDialogDefinition } from 'src/client/types/IAppModalDialog';

const actionCreators = commonContainer.get<IAppActionCreators>(TYPES.ActionCreators);

export const types = {
  ROOM_TOGGLE_LEFT_PANEL_VISIBILITY: 'VIEW:ROOM:TOGGLE_LEFT_PANEL_VISIBILITY',
  ROOM_TOGGLE_RIGHT_PANEL_VISIBILITY: 'VIEW:ROOM:TOGGLE_RIGHT_PANEL_VISIBILITY',
  SETTINGS_PANEL_CHANGE_TAB: 'VIEW:SETTINGS_PANEL_CHANGE_TAB',
  MODAL_DIALOG_SHOW: 'MODAL_DIALOG_SHOW',
  MODAL_DIALOG_HIDE: 'MODAL_DIALOG_HIDE',
  GOTO_RECORDINGS: 'GOTO_RECORDINGS',
  WEBRTC_SERVICE_CHANGE: 'APP:WEBRTC_SERVICE_CHANGE',
};

export default {
  ...actionCreators,
  roomToggleLeftPanelVisibility: () => ({
    type: types.ROOM_TOGGLE_LEFT_PANEL_VISIBILITY,
  }),
  roomToggleRightPanelVisibility: () => ({
    type: types.ROOM_TOGGLE_RIGHT_PANEL_VISIBILITY,
  }),
  changeSettingsPanelTab: (tab: string) => ({
    type: types.SETTINGS_PANEL_CHANGE_TAB,
    tab,
  }),
  showModalDialog: (modal: IAppModalDialogDefinition) => ({
    type: types.MODAL_DIALOG_SHOW,
    modal,
  }),
  hideModalDialog: () => ({
    type: types.MODAL_DIALOG_HIDE,
  }),
  gotoRecordings: (userId: string) => ({
    type: types.GOTO_RECORDINGS,
    userId,
  }),
  appChangeWebrtcService: (inx: number) => ({
    type: types.WEBRTC_SERVICE_CHANGE,
    inx,
  }),
};
