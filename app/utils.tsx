import React, { CSSProperties } from 'react';
import { ToastOptions } from 'react-toastify';

const NOTIFICATION_TIMEOUT = 3000;
const ONE_SEC = 1000;
const ONE_HOUR = 3600000; // in ms
const REC_START_ERROR_NOTIFICATION_SHOW_TIME = 20 * ONE_SEC; // tslint:disable-line

const ERROR_MESSAGE: Record<number, React.ReactElement> = {
  0: <>Unexpected error</>,
  1: (
    <>
      Screen sharing prohibited by user.
      <br />
      Please enable in the settings and reload the page
    </>
  ),
  20: (
    <>
      Recording service is unavailable.
      <br />
      Please contact <a mail-to="support@set2meet.com">support@set2meet.com</a>
    </>
  ),
  21: (
    <>
      Unauthorized connection.
      <br />
      Please contact <a mail-to="support@set2meet.com">support@set2meet.com</a>
    </>
  ),
  22: (
    <>
      Recording service is too busy.
      <br />
      Please wait a minute and try again
    </>
  ),
};

export const recordingStartErrorNotification = (code: number) => {
  return {
    autoClose: REC_START_ERROR_NOTIFICATION_SHOW_TIME,
    content: ERROR_MESSAGE[code] || ERROR_MESSAGE[0],
    hideProgressBar: true,
  };
};

export const createScreenSharingNotification = (message?: string, extensionLink?: string) => {
  let content;
  if (extensionLink) {
    content = (
      <React.Fragment>
        Please install an extention to share your screen
        <br />
        Open{' '}
        <a href={extensionLink} target="_blank">
          Web store
        </a>
      </React.Fragment>
    );
  } else if (message) {
    content = <React.Fragment>{message}</React.Fragment>;
  } else {
    return;
  }

  return {
    hideProgressBar: true,
    autoClose: NOTIFICATION_TIMEOUT,
    content,
  };
};

export const createRecordingNotification = (recUrl: string) => {
  const content = (
    <React.Fragment>
      <a href={recUrl} target="_blank">
        {`Recording: ${recUrl}`}
      </a>
    </React.Fragment>
  );

  return {
    hideProgressBar: true,
    autoClose: ONE_HOUR,
    content,
  };
};

export const createRecStopNotification = (userId: string) => {
  const linkStyle: CSSProperties = {
    color: 'black',
    fontWeight: 'bold',
  };
  const content = (
    <div>
      Your recording has been saved.
      <br />
      <a href={`/recordings/${userId}`} style={linkStyle} target="_blank">
        Manage recordings
      </a>
    </div>
  );
  const options: ToastOptions = {
    autoClose: false,
  };

  return {
    type: 'success',
    content,
    ...options,
  };
};

// valid address to bot requests
// https://api.ipify.org/
// http://bot.whatismyipaddress.com/

const getIPURLsLib = ['https://api.ipify.org/', 'http://bot.whatismyipaddress.com/'];
const getIPfetch = (url: string) => fetch(url).then((res) => res.text());

export const getIP = (): Promise<string> => getIPfetch(getIPURLsLib[0]).catch(() => getIPfetch(getIPURLsLib[1]));
