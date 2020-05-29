import Socket = SocketIOClient.Socket;
import { AnyAction, Dispatch, Store } from 'redux';
import _get from 'lodash/get';
import { push } from 'react-router-redux';
import { TYPES } from 'src/ioc/TYPES';
import { IMediaReduxState } from 'src/ioc/ioc-interfaces';
import { isGuest, isOwner } from 'src/client/app/selectors';
import { IStoreState } from '../types/store-state';
import { IAppReduxEnumMiddleware, IModuleReduxMiddleware } from 'src/ioc/ioc-interfaces';
import clientContainer, { entities } from 'src/ioc/ioc-client';
import { IAppConfig, DisconnectReason } from 'src/ioc/ioc-interfaces';
import { createRecStopNotification, recordingStartErrorNotification } from './utils';
import actionCreators, { types } from './appActionCreators';
import { logStoreActions, bindReduxLogs, bindServerLogs } from 'src/modules/logger/src/client';
import { apiActionTypes } from 'src/modules/common/src/modules/api/actionCreators';
import { AuthProvider } from 'ioc/ioc-auth';
import { IAuthToken } from 'src/modules/auth/src/server/index.ts';

const REC_STOP_NOTIFICATION_TIMEOUT = 3000;

let middlewareEnumNotBuilded: boolean = true;
let appMiddlewareEnum: IAppReduxEnumMiddleware = {};

const syncWebrtcServiceName = (store: any, action: AnyAction) => {
  // before set room state,
  // sync settings webrtc service name with the same in the room
  // so, if room has webrtc service name - set it in settings as based
  const appState: IStoreState = store.getState();
  const roomWebrtcServiceName = _get(action, 'roomState.webrtcService.serviceName', null);

  if (!roomWebrtcServiceName) {
    // no service name if room ID was incorrect
    return;
  }

  const { services, selectedServiceInx, defaultServiceInx } = appState.app.webrtcConfig;
  const settingsWebrtcServiceName = services[selectedServiceInx].name;

  if (!roomWebrtcServiceName) {
    store.dispatch(actionCreators.appChangeWebrtcService(defaultServiceInx));
  } else if (roomWebrtcServiceName !== settingsWebrtcServiceName) {
    const roomServiceInx = services.reduce((num, item, inx) => {
      return item.name === roomWebrtcServiceName ? inx : num;
    }, NaN);

    store.dispatch(actionCreators.appChangeWebrtcService(roomServiceInx));
  }
};

const resetWebrtcServiceName = (store: any) => {
  const { defaultServiceInx } = store.getState().app.webrtcConfig;

  store.dispatch(actionCreators.appChangeWebrtcService(defaultServiceInx));
};

const stopRecording = (store: any) => {
  const state = store.getState();
  const { isRecording } = state.recording;
  const recordId = state.room.recording.recId;

  if (!(isRecording && recordId)) {
    return;
  }

  store.dispatch(entities.appActionCreators.recordingStop());
};

const recordingRecordAddUser = (store: any) => {
  const state = store.getState();
  const isUserGuest = isGuest(state);
  const recordId = state.room.recording.recId;

  if (isUserGuest || !recordId) {
    return;
  }

  const userId = state.auth.user.id;
  const { sendAction, recordingParticipantAdd } = entities.appActionCreators;

  store.dispatch(sendAction(recordingParticipantAdd(recordId, userId)));
};

const initAppMiddlewareEnum = () => {
  const { appActionTypes } = entities;

  middlewareEnumNotBuilded = false;

  bindReduxLogs();
  bindServerLogs();

  appMiddlewareEnum = {
    [appActionTypes.SESSION_CLOSED](store, next, action) {
      const { sessionId } = action;
      const state = store.getState();
      const { appActionCreators } = entities;

      if (isOwner(state)) {
        // TODO this must be on server side
        // but don't know where this code must be executed (hint: on in chat and not in webphone)
        // we don't have mechanism to dispatch new actions on server-side

        store.dispatch(appActionCreators.sendRoomAction(appActionCreators.clearChat(sessionId)));
      } else if (state.auth.user) {
        const roomId = _get(state, 'room.state.id');

        store.dispatch(appActionCreators.sendAction(appActionCreators.leaveRoom(roomId, state.auth.user.id)));
      }

      next(action);
    },
    /**
     * Reset presentations ONLY when OWNER ends MEETING!
     */
    [appActionTypes.END_MEETING](store, next, action) {
      const { appActionCreators } = entities;
      store.dispatch(appActionCreators.sendRoomAction(appActionCreators.resetPresentationState()));

      stopRecording(store);

      next(action);
    },

    [appActionTypes.LOGIN_SUCCESS](store, next, action) {
      // create app socket connection
      store.dispatch(entities.appActionCreators.connect(action.payload.tokens.accessToken));
      next(action);
    },
    [appActionTypes.USER_JOIN_ROOM](store, next, action) {
      next(action);

      const state = store.getState();
      const userId = state.auth.user.id;
      const { appActionCreators } = entities;

      // for self only
      if (userId !== action.userId) {
        return;
      }

      // required by socket sessions map as filter by roomId
      store.dispatch(
        entities.appActionCreators.sendRoomAction({
          type: entities.appActionTypes.ROOM_JOIN_SUCCESS,
          userId: action.userId,
          roomId: action.roomId,
        })
      );

      // patch recording
      recordingRecordAddUser(store);

      // create webphone connection
      store.dispatch(appActionCreators.webphoneConnect());

      // send other peers user info about me
      store.dispatch(
        appActionCreators.sendRoomAction(appActionCreators.updateParticipantInfo(state.webphone.publisher))
      );
    },
    [appActionTypes.LOGOUT](store, next, action) {
      const state = store.getState();
      const roomId = _get(state, 'room.state.id');
      const { appActionCreators } = entities;

      stopRecording(store);

      if (roomId) {
        store.dispatch(appActionCreators.leaveRoom(roomId, action.userId));
      }

      // disconect from app socket
      store.dispatch(appActionCreators.disconnect());

      // disconnect webphone
      store.dispatch(appActionCreators.webphoneDisconnect(DisconnectReason.EXIT));

      next(action);
    },
    [appActionTypes.ROOM_LEAVE](store, next, action) {
      const config = clientContainer.get<IAppConfig>(TYPES.Config);
      const state: IStoreState = store.getState();
      const { appActionCreators } = entities;

      // TODO: This should be done on the server
      if (isOwner(state) && state.room.recording.isRecording) {
        store.dispatch(appActionCreators.pluginRecordingStop());
      }

      // disconnect webphone
      store.dispatch(appActionCreators.webphoneDisconnect(DisconnectReason.EXIT));

      if (isGuest(state)) {
        window.location.href = config.project.urls.home;
      } else {
        next(action);
        // this action mast be after webphone disconnect
        setTimeout(() => resetWebrtcServiceName(store), 1);
      }
    },
    [appActionTypes.USER_LEFT_ROOM](store, next, action) {
      store.dispatch(entities.appActionCreators.webphoneUserLeftCall(action.userId));
      next(action);
    },
    [appActionTypes.DISCONNECTED](store, next, action) {
      next(action);

      if (action.reason === DisconnectReason.UNAUTHORIZED) {
        store.dispatch(entities.appActionCreators.logout());
      }
    },
    [appActionTypes.RECORDING_START_ERROR](store, next, action, socket, storeKey) {
      store.dispatch(entities.appActionCreators.showNotification(recordingStartErrorNotification(action.code)));
      next(action);
    },
    [appActionTypes.ROOM_RECORDING_STOPPED](store, next, action, socket, storeKey) {
      // update recording plugin
      const appState = store.getState();

      if (isGuest(appState)) {
        next(action);
        return;
      }

      const userId = appState.auth.user.id;
      const notification = createRecStopNotification(userId);
      const notifAction = entities.appActionCreators.showNotification(notification);
      setTimeout(() => {
        store.dispatch(notifAction);
      }, REC_STOP_NOTIFICATION_TIMEOUT);
      next(action);
    },
    [appActionTypes.ROOM_RECORDING_STARTED](store, next, action, socket, storeKey) {
      next(action);
      recordingRecordAddUser(store);
    },
    [appActionTypes.ROOM_SET_INFO](store, next, action, socket, storeKey) {
      next(action);
      syncWebrtcServiceName(store, action);
    },
    [appActionTypes.SET_ROOM](store, next, action, socket, storeKey) {
      syncWebrtcServiceName(store, action);
      next(action);
    },
    [types.MODAL_DIALOG_HIDE](store, next, action, socket, storeKey) {
      const state = store.getState();
      // If closed media settings & if still existed unplugged devices
      // - dispatch event to ignore them
      const { inputAudio, inputVideo } = (state.media as IMediaReduxState).unplugged;
      const isSettingsPanelOpened = state.app.view.modalDialog.view.Name === 'SettingsPanelModal';
      const hasAnyUnpluggedDevices = Boolean(inputAudio || inputVideo);

      if (isSettingsPanelOpened && hasAnyUnpluggedDevices) {
        store.dispatch(entities.appActionCreators.ignoreUnpluggedDevices());
      }

      next(action);
    },
    [appActionTypes.SET_UNPLUGGED_DEVICES](store, next, action, socket, storeKey) {
      next(action);

      const { inputAudio, inputVideo } = action;

      if (!(inputAudio || inputVideo)) {
        return;
      }

      // choose: show or not warning about unplugged devices
      const config = clientContainer.get<IAppConfig>(TYPES.Config);
      const state: IStoreState = store.getState();
      // at this moment only one modal - MediaSettingsPanel
      // think about other dialogs: queue/importance of dialogs?
      const hasOpenedModalDialog = !!state.app.view.modalDialog;
      const path = state.router.location.pathname;
      const isOnHomePage = path === '/';
      const isOnTestPage = path === config.project.routes.userMediaCheck;
      const isUserSetupComplete = _get(state, 'webphone.userSetup.isComplete');
      const isOwnerUser = isOwner(state);
      const isOnUserSetup = isOwnerUser ? false : !isUserSetupComplete;
      const { Media } = entities.components;

      if (isOnHomePage || isOnTestPage || hasOpenedModalDialog || isOnUserSetup) {
        return;
      }

      store.dispatch(
        actionCreators.showModalDialog({
          view: Media.UnpluggedDeviceWarning,
          closeOnOutsideClick: false,
        })
      );
    },
    [types.GOTO_RECORDINGS](store, next, action, socket, storeKey) {
      next(action);
      store.dispatch(
        push({
          pathname: `/recordings/${action.userId}`,
        })
      );
    },
    [appActionTypes.RECORDING_REMOVE_RECORD_SUCCESS](store, next, action, socket, storeKey) {
      const { auth } = store.getState();
      const { ownerId } = action;

      if (ownerId === auth.user.id) {
        store.dispatch(
          actionCreators.showNotification({
            content: `Recording was removed successfully`,
            autoClose: 4000,
          })
        );
      }

      next(action);
    },
    [apiActionTypes.ACTION_ROOM_SEND](store, next, action) {
      // const keycloak = AuthProvider.getAdapter();
      // // TODO::fix adapter;
      //
      // if (keycloak && !keycloak.authenticated) {
      //   console.log('Keycloak: Session is rotten, attempt to create new...');
      //   const tokens: IAuthToken = JSON.parse(sessionStorage.getItem('tokens'));
      //
      //   keycloak
      //     .init({ promiseType: 'native' , onLoad: 'check-sso', token: tokens.accessToken, refreshToken: tokens.refreshToken, })
      //     .then((e:any) => {
      //       if (e) {
      //         console.log('Keycloak: Re-login success');
      //         const accessToken = keycloak.token;
      //         const refreshToken = keycloak.refreshToken;
      //
      //         tokens.accessToken = accessToken;
      //         tokens.refreshToken = refreshToken;
      //
      //         sessionStorage.setItem('tokens', JSON.stringify(tokens));
      //       }
      //     });
      // } else {
      //   keycloak
      //     .updateToken(1000)
      //     .then((refreshed:any) => {
      //       if (refreshed) {
      //         console.log('Keycloak: Token were successfully refreshed');
      //       } else {
      //         console.log('Keycloak: Token is still valid');
      //       }
      //     })
      //     .catch(() => console.log('Keycloak: Cant refresh token'));
      // }
      next(action);
    },
  };
};

export const appMiddleware: IModuleReduxMiddleware = (storeKey: string) => (socket: Socket) => (store: Store) => (
  next: Dispatch<AnyAction>
) => (action: AnyAction) => {
  if (entities.config.logger.saveReduxActions) {
    logStoreActions(action);
  }

  if (middlewareEnumNotBuilded) {
    initAppMiddlewareEnum();
  }

  if (appMiddlewareEnum[action.type]) {
    return appMiddlewareEnum[action.type](store, next, action, socket, storeKey);
  }

  return next(action);
};
