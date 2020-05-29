import React from 'react';
import { connect } from 'react-redux';
import isOwner from 'src/client/app/selectors/isOwner';
import { IStoreState } from 'src/client/types/store-state';
import { ActionCreator, AnyAction } from 'redux';
import appActions from 'src/client/app/appActionCreators';
import autoStartSession from 'src/client/app/selectors/autoStartSession';
import { entities } from 'src/ioc/ioc-client';
import { push } from 'react-router-redux';
import HeaderSplitter from 'src/client/components/HeaderSplitter';

const { UI, WebPhone, Recording } = entities.components;

interface IRoomHeaderStateProps {
  roomId: string;
  isRoomOwner: boolean;
  user: any;
  location: {
    hash: string;
    pathname: string;
    search: string;
  };
  sessionId: string;
  landingPageURL: string;
  isReconnecting: boolean;
  autoStartSession: boolean;
  disableRecordings: boolean;
}

interface IRoomHeaderDispatchProps {
  changeLocation: (path: string) => void;
  sendAction: ActionCreator<AnyAction>;
}

export class RoomHeader extends React.Component<IRoomHeaderDispatchProps & IRoomHeaderStateProps> {
  private _gotoDashboard() {
    this.props.changeLocation('/');
  }

  private _leaveRoom = () => {
    const { roomId, user } = this.props;

    if (user.guest) {
      window.location.href = this.props.landingPageURL;
    } else if (roomId) {
      this.props.sendAction(appActions.leaveRoom(roomId, user.id));
    } else {
      this._gotoDashboard();
    }
  };

  public componentWillUnmount(): void {
    const { roomId, user } = this.props;

    if (roomId) {
      this.props.sendAction(appActions.leaveRoom(roomId, user.id));
    }
  }

  public render() {
    const { isRoomOwner, sessionId, isReconnecting, roomId, disableRecordings } = this.props;

    return (
      <React.Fragment>
        {roomId &&
          sessionId &&
          !disableRecordings && (
            <Recording.RecordingButton isOwner={isRoomOwner} sessionId={sessionId} isReconnecting={isReconnecting} />
          )}
        <HeaderSplitter />
        <UI.Button icon="leave" title="LEAVE ROOM" bsStyle="secondary" onClick={this._leaveRoom} />
        {isRoomOwner && <WebPhone.ButtonSession />}
      </React.Fragment>
    );
  }
}

export default connect(
  (state: IStoreState) => {
    const {
      config,
      constants: { webrtcConstants },
    } = entities;
    const sessionId = (state.room as any).webrtcService.sessionId;
    const isConnected = state.webphone.connectionStatus === webrtcConstants.CONNECTION_STATUS.ESTABLISHED;
    const isReconnecting = !isConnected && state.room.recording.isRecording;

    return {
      user: state.auth.user,
      roomId: state.room.state.id,
      isRoomOwner: isOwner(state),
      isReconnecting,
      landingPageURL: config.project.urls.home,
      autoStartSession: autoStartSession(state),
      sessionId: (isConnected || isReconnecting) && sessionId ? sessionId : null,
      disableRecordings: 'gui' in config.project ? config.project.gui.disableRecordings : false,
    };
  },
  {
    changeLocation: push,
    sendAction: appActions.sendAction,
  }
)(RoomHeader);
