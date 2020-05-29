import { IAppRecordingConfig } from 'src/client/types/IAppConfig';
import { IAppModalDialogDefinition } from 'src/client/types/IAppModalDialog';

export interface IAppConfigProject {
  name: string;
  urls: {
    home: string;
  };
  routes: {
    userMediaCheck: string;
  };
  contacts: {
    support: string;
  };
  activeTools: string[];
  gui?: {
    disableRecordings?: boolean;
  };
}

export interface IAppSettingsPanel {
  currentTab: string;
}

export interface IAppWebRTCInfo {
  key: string;
  name: string;
  title: string;
}

export interface IAppWebRTCConfig {
  services: IAppWebRTCInfo[];
  defaultServiceInx: number; // index of IAppWebRTCInfo of default service
  selectedServiceInx: number; // index of IAppWebRTCInfo of current service
}

export interface IApp {
  recordingConfig: IAppRecordingConfig;
  webrtcConfig: IAppWebRTCConfig;
  view: {
    room: {
      isLeftPanelVisible: boolean;
      isRightPanelVisible: boolean;
      isSessionJustEnded: boolean;
    };
    settingsPanel: IAppSettingsPanel;
    modalDialog: IAppModalDialogDefinition;
  };
}

export type UserColors = Record<string, string> & {
  default: string;
};
