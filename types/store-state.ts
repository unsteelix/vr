import { IApp } from './app';
import { RouterState } from 'react-router-redux';
import { vrCommon } from 'src/modules/common';
import IRoomReduxState = vrCommon.common.room.IRoomReduxState;
import { IRecordingReduxState } from 'src/modules/recording';

export interface IStoreState {
  app: IApp;
  router: RouterState;
  room: {
    webrtcService: any;
    state: IRoomReduxState;
    chat: any;
    recording: IRecordingReduxState;
  };
  fullscreen: any;
  connection: any;
  webphone: any;
  auth: any;
}
