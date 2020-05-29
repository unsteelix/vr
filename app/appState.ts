import { IApp } from '../types/app';
import { entities } from 'src/ioc/ioc-client';

const { webrtcServices } = entities;

// TODO: move to client config
const webrtcServiceTitleMap: Record<string, string> = {
  opentok: 'TokBox',
  p2p: 'Peer-to-peer (no media server)',
};

const services = Object.keys(webrtcServices).map((key) => ({
  key,
  name: webrtcServices[key].name,
  title: webrtcServiceTitleMap[key],
}));

export default {
  recordingConfig: {
    enabled: false,
    janusApiUrl: '',
  },
  webrtcConfig: {
    services,
    defaultServiceInx: 0,
    selectedServiceInx: 0,
  },
  view: {
    room: {
      isLeftPanelVisible: true,
      isRightPanelVisible: true,
      isSessionJustEnded: false,
    },
    settingsPanel: {
      isVisible: false,
      currentTab: 'Audio',
    },
    modalDialog: null,
  },
} as IApp;
