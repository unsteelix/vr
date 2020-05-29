import React from 'react';
import { connect } from 'react-redux';
import { IStoreState } from 'src/client/types/store-state';
import { RouteComponentProps } from 'react-router';
import { entities, IAuthUser, IFullscreenButtonProps, IFullscreenContainerProps } from 'src/ioc/ioc-client';
import { ActionCreator, AnyAction } from 'redux';
import appActions from 'src/client/app/appActionCreators';
import { autoStartSession, connectedToServer, getUserColors } from 'src/client/app/selectors';
import { get as _get } from 'lodash';
import styled, { withTheme } from 'styled-components';
import {
  styledAsidePanel,
  styledBasePanle,
  styledCenterPanel,
  styledControlsPanel,
  styledControlsPanelGroup,
  styledPanelContainer,
} from './Room.style';
import { isOwner as isOwnerSelector } from 'src/client/app/selectors/index';
import CollaborationPanel from 'src/client/components/CollaborationPanel';
import PRESENT_TOOLS from 'src/client/components/PRESENT_TOOLS';
import SidebarPanel from 'src/client/components/SidebarPanel';
import ReconnectingOverlay from 'src/client/components/ReconnectingOverlay';
import RoundButton from 'src/modules/common/src/ui/components/RoundButton/RoundButton';
import RoomIsFull from 'src/client/components/RoomIsFull';

const SIDE_PANEL_LEFT_WIDTH = 60;
const SIDE_PANEL_RIGHT_WIDTH = 295;

const {
  UI,
  Graph2D,
  WebPhone,
  Notification,
  Whiteboard,
  CodeEditor,
  Notepad,
  Fullscreen,
  Presentations,
  Chat,
} = entities.components;
const { chatSelectors } = entities.selectors;
const Notifications = <Notification.NotificationContainer />;

const PanelContainer = styled.div`
  ${styledPanelContainer};
`;
const PanelCenter = styled.div`
  ${styledCenterPanel};
`;
const PanelAside = withTheme(
  styled.div`
    ${styledAsidePanel};
  `
);
const PanelBase = withTheme(
  styled.div`
    ${styledBasePanle};
  `
);
const PanelControls = styled.div`
  ${styledControlsPanel};
`;
const PanelControlsGroup = styled.div`
  ${styledControlsPanelGroup};
`;

type ActiveTool = IFullscreenContainerProps & {
  defaultButton: boolean;
  reactNode: React.ReactNode;
  buttonButtonColorMode: IFullscreenButtonProps['colorMode'];
};

interface IRoomStateProps {
  fullscreenStatus: boolean;
  locationRoomId: string;
  stateRoomId: string;
  user: IAuthUser;
  room: any;
  isJoinedToTheRoom: boolean;
  isUserSetupComplete: boolean;
  isRoomOwner: boolean;
  isLeftPanelVisible: boolean;
  isRightPanelVisible: boolean;
  currentTool: string;
  isSessionJustEnded: boolean;
  autoStartSession: boolean;
  numberOfUnreadMessages: number;
  connectedToServer: boolean;
  dontShowUserSetup: boolean;
  userColor: string;
}

interface IRoomDispatchProps {
  sendAction: ActionCreator<AnyAction>;
  roomToggleLeftPanelVisibility: ActionCreator<AnyAction>;
  roomToggleRightPanelVisibility: ActionCreator<AnyAction>;
}

export class RoomPage extends React.Component<IRoomStateProps & IRoomDispatchProps, { visible: boolean }> {
  private _joinRoomStatus: 'none' | 'connecting' = 'none';

  private get isUserSetupComplete(): boolean {
    if (localStorage.getItem('robot')) {
      return true;
    }

    return this.props.isRoomOwner ? true : this.props.isUserSetupComplete || this.props.dontShowUserSetup;
  }

  private _getStateMessage = () => {
    if (this.props.stateRoomId === null && _get(this.props.room, 'state.error.message')) {
      return _get(this.props.room, 'state.error.message');
    }

    if (this.props.isSessionJustEnded) {
      return 'Thank you for joining!';
    }

    return !this.props.room.state.ownerId || this.props.room.state.ownerId === this.props.user.id
      ? 'Entering the room...'
      : 'Please wait for the host to start this meeting';
  };

  private get _activeTool(): ActiveTool {
    let mode: IFullscreenContainerProps['mode'] = 'stretch';
    let reactNode: React.ReactNode;
    let defaultButton: boolean = true;
    let buttonButtonColorMode: IFullscreenButtonProps['colorMode'] = 'default';

    switch (this.props.currentTool) {
      case PRESENT_TOOLS.whiteboard.name: {
        mode = 'contain';
        buttonButtonColorMode = 'inversed';
        reactNode = (
          <Whiteboard
            isModerator={!!this.props.isRoomOwner}
            localStatePath="whiteboard"
            statePath="room.whiteboard"
            userId={this.props.user.id}
            roomId={this.props.stateRoomId}
            userColor={this.props.userColor}
          />
        );
        break;
      }
      case PRESENT_TOOLS.codeEditor.name: {
        reactNode = <CodeEditor roomId={this.props.stateRoomId} />;
        break;
      }
      case PRESENT_TOOLS.notepad.name: {
        reactNode = <Notepad roomId={this.props.stateRoomId} />;
        break;
      }
      case PRESENT_TOOLS.presentations.name: {
        mode = 'contain';
        buttonButtonColorMode = 'inversed';
        reactNode = <Presentations />;
        break;
      }
      case PRESENT_TOOLS.graph2d.name: {
        reactNode = <Graph2D roomId={this.props.stateRoomId} isOwner={this.props.isRoomOwner} />;
        break;
      }
      default: {
        defaultButton = false;
        reactNode = (
          <WebPhone.BaseScreen
            roomId={this.props.stateRoomId}
            autoStartSession={this.props.autoStartSession}
            fullscreenStatus={this.props.fullscreenStatus}
            fullscreenButton={Fullscreen.Button}
          />
        );
      }
    }

    return { defaultButton, reactNode, mode, buttonButtonColorMode };
  }

  private joinRoom() {
    this._joinRoomStatus = 'connecting';
    this.props.sendAction(appActions.joinRoom(this.props.locationRoomId, this.props.user.id));
  }

  private getRoomInfo() {
    this.props.sendAction(appActions.getRoomInfo(this.props.locationRoomId, ['webrtcService.serviceName']));
  }

  public componentDidMount() {
    if (this.isUserSetupComplete && this.props.connectedToServer) {
      this.joinRoom();
    } else if (!this.isUserSetupComplete) {
      this.getRoomInfo();
    }

    window.addEventListener('beforeunload', () => {
      localStorage.removeItem('robot');
    });
  }

  public shouldComponentUpdate(nextProps: IRoomStateProps): boolean {
    if (this.props.stateRoomId && !nextProps.stateRoomId) {
      // user leave room, and no render needed
      return false;
    }

    return true;
  }

  public componentDidUpdate(prevProps: IRoomStateProps) {
    if (this.isUserSetupComplete && this.props.connectedToServer && this._joinRoomStatus === 'none') {
      this.joinRoom();
    }
    if (prevProps.connectedToServer && !this.props.connectedToServer) {
      // disconnected, for example
      this._joinRoomStatus = 'none';
    }
  }

  private _renderRoomJoinError(errorCode: number): React.ReactNode {
    const { RoomJoinError } = entities.constants;

    if (errorCode === RoomJoinError.IS_FULL) {
      return <RoomIsFull />;
    }

    const errorText: Record<number, string> = {
      [RoomJoinError.WRONG_ID]: 'The room ID is incorrect',
      [RoomJoinError.ALREADY_JOINED]: `Can't join room. You have already joined this room in another tab`,
    };

    return <UI.WaitingPage text={errorText[errorCode]} />;
  }

  public render() {
    const errorCode = this.props.room.state.error.code;

    if (errorCode) {
      return this._renderRoomJoinError(errorCode);
    }

    if (this.isUserSetupComplete && this.props.isJoinedToTheRoom) {
      const { fullscreenStatus } = this.props;
      const activeTool = this._activeTool;

      return (
        <React.Fragment>
          <PanelContainer>
            <PanelAside>
              <UI.SidePanel
                position="left"
                width={SIDE_PANEL_LEFT_WIDTH}
                open={this.props.isLeftPanelVisible}
                onToggle={this.props.roomToggleLeftPanelVisibility}
              >
                <CollaborationPanel />
              </UI.SidePanel>
            </PanelAside>
            <PanelCenter>
              <PanelBase>
                <Fullscreen.Container mode={activeTool.mode}>
                  {activeTool.reactNode}
                  {activeTool.defaultButton && <Fullscreen.Button colorMode={activeTool.buttonButtonColorMode} />}
                  {fullscreenStatus && Notifications}
                </Fullscreen.Container>
              </PanelBase>
              <PanelControls>
                <PanelControlsGroup>
                  <WebPhone.ButtonMicrophone />
                  <WebPhone.ButtonCamera />
                  <WebPhone.ButtonScreenSharing container={RoundButton} />
                </PanelControlsGroup>
              </PanelControls>
              {!fullscreenStatus && Notifications}
            </PanelCenter>
            <PanelAside>
              <UI.SidePanel
                position="right"
                width={SIDE_PANEL_RIGHT_WIDTH}
                open={this.props.isRightPanelVisible}
                onToggle={this.props.roomToggleRightPanelVisibility}
                indicatorValue={this.props.numberOfUnreadMessages}
              >
                <SidebarPanel />
              </UI.SidePanel>
            </PanelAside>
          </PanelContainer>
          <ReconnectingOverlay />
          {this.props.user && <Chat.SoundNotifications userId={this.props.user.id} statePath="room.chat" />}
        </React.Fragment>
      );
    }

    if (!this.isUserSetupComplete) {
      return (
        <WebPhone.UserSetup selfContained={false} userId={this.props.user.id} roomId={this.props.locationRoomId} />
      );
    }

    return <UI.WaitingPage text={this._getStateMessage()} />;
  }
}

export default connect<IRoomStateProps>(
  (state: IStoreState, ownProps: RouteComponentProps<{ roomId: string }>) => {
    const { user } = state.auth;
    const isOwner = isOwnerSelector(state);
    const stateRoomId = state.room.state.id;
    const { isLeftPanelVisible, isRightPanelVisible, isSessionJustEnded } = state.app.view.room;
    const userColors = getUserColors(state);

    return {
      isReady: !!stateRoomId,
      stateRoomId,
      user,
      userColor: userColors[user.id] || userColors.default,
      fullscreenStatus: state.fullscreen.status,
      locationRoomId: ownProps.match.params.roomId,
      room: state.room,
      isLeftPanelVisible,
      isRightPanelVisible,
      isSessionJustEnded,
      isJoinedToTheRoom: _get(state, 'room.state.id') && (isOwner || _get(state, 'room.webrtcService.sessionId')),
      isUserSetupComplete: _get(state, 'webphone.userSetup.isComplete'),
      dontShowUserSetup: _get(state, 'webphone.userSetup.dontShowAgain'),
      isRoomOwner: isOwner,
      currentTool: state.room.state.currentTool,
      autoStartSession: autoStartSession(state),
      numberOfUnreadMessages: chatSelectors.numberOfUnreadMessages(state.room.chat),
      connectedToServer: connectedToServer(state),
    };
  },
  {
    sendAction: appActions.sendAction,
    roomToggleLeftPanelVisibility: appActions.roomToggleLeftPanelVisibility,
    roomToggleRightPanelVisibility: appActions.roomToggleRightPanelVisibility,
  }
)(RoomPage);
