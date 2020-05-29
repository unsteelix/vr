import _get from 'lodash/get';
import _merge from 'lodash/merge';
import { getIP } from './utils';
import { isGuest } from './selectors';
import { LOGGER_ACTION_TYPES } from 'src/modules/logger/src/common/actionCreators';
import { entities } from 'ioc/ioc-client';
import { IBrowserInfo } from 'ioc/ioc-interfaces';

const browser = entities.browser.info;

type GetStateFunc = () => any;
type DispatchActionFunc = (action: any) => void;

type ReportUserInfo = {
  ip: string;
  user: any;
  inputAudio: MediaDeviceInfo;
  inputVideo: MediaDeviceInfo;
  browser: IBrowserInfo;
  resolution: string;
  userIsGuest: boolean;
};

const userInfoCache: ReportUserInfo = {
  ip: '',
  user: null,
  inputAudio: null,
  inputVideo: null,
  userIsGuest: true,
  browser: { ...browser },
  resolution: `${screen.width}x${screen.height}`,
};

getIP().then((ip: string) => (userInfoCache.ip = ip));

export const appReporterReset = () => {
  // on disconnect or other reason - required to clear cache,
  // becouse server can "drop" all user info data
  userInfoCache.user = null;
  userInfoCache.inputAudio = null;
  userInfoCache.inputVideo = null;
};

export const appReporterCreate = (getState: GetStateFunc, dispatchAction: DispatchActionFunc) => {
  return () => {
    const state = getState();
    let userInfoChanged: boolean = false;
    const currUserInfo = _get(state, 'auth.user', null);

    if (!currUserInfo) {
      appReporterReset();
      return;
    }

    if (!userInfoCache.ip) {
      return;
    }

    // update user info, if any user props changed, include id
    if (userInfoCache.user !== currUserInfo) {
      userInfoChanged = true;

      userInfoCache.user = currUserInfo;
      userInfoCache.userIsGuest = isGuest(state);
    }

    // update input audio/video devices info
    const { inputAudio, inputVideo } = state.media.default;

    if (userInfoCache.inputAudio !== inputAudio) {
      userInfoChanged = true;
      userInfoCache.inputAudio = inputAudio;
    }

    if (userInfoCache.inputVideo !== inputVideo) {
      userInfoChanged = true;
      userInfoCache.inputVideo = inputVideo;
    }

    // send action if any props changed
    if (userInfoChanged) {
      dispatchAction({
        type: LOGGER_ACTION_TYPES.LOGGER_REPORT_UPDATE_USER_INFO,
        event: { name: 'userReportInfo', data: userInfoCache },
      });
    }

    // todo: import 'userReportInfo' and ReportUserInfo from reports module
    // its garantie correct data types and reporting service work (may be)
  };
};
