import { IAppConfigProject } from './app';

export interface IAppConfigService {
  url: string;
  path: string;
}

export interface IAppRecordingConfig {
  enabled: boolean;
  janusApiUrl: string;
}

export interface IAppPresentationsConfig {
  service: IAppPresentationsServiceConfig;
}

export interface IAppPresentationsServiceConfig {
  url: string;
  ws: string;
  wss: string;
  path: {
    upload: string;
    download: string;
  };
}

export interface IAppFeedbackServiceConfig {
  route: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  params: {
    from: string;
    to: string;
    subject: string;
  };
}

export interface IAppConfig {
  auth: any; // TODO:: type here
  service: IAppConfigService;
  project: IAppConfigProject;
  clientConfig: {
    autoStartOnDemandSession?: boolean;
    enableMicOnSessionStart?: boolean;
  };
  logger: {
    routes: {
      getLogs: string;
    };
    saveReduxActions?: boolean;
  };
  chromeExtensionId?: string; // TODO
  recording: IAppRecordingConfig;
  presentations: IAppPresentationsConfig;
  feedback: any;
  webrtc: {
    default: string;
    p2p: {
      RTCConfiguration: RTCConfiguration;
    };
  };
  chat: {
    maxUploadFileSize: number;
    maxMessageLength: number;
  };
}
