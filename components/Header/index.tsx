import _get from 'lodash/get';
import React, { ComponentClass } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IStoreState } from 'src/client/types/store-state';
import UserMenu from '../UserMenu';
import SettingsPanel from 'src/client/components/SettingsPanel';
import FeedbackPanel from 'src/modules/feedback/src/client/components/FeedbackPanel/FeedbackPanel';

// TODO get from ioc list of headers
import RoomHeader from 'src/client/routes/Room/RoomHeader';
import { entities } from 'src/ioc/ioc-client';
import appActionCreators from 'src/client/app/appActionCreators';
import { ActionCreator, AnyAction } from 'redux';
import { styledNavbar, styledNavbarCollapse } from './Header.style';

const headers: Record<string, ComponentClass<any>> = {
  room: RoomHeader,
};

const StyledNavbar = styled(Navbar)`
  ${styledNavbar};
`;
const StyledNavbarCollapse = styled(Navbar.Collapse)`
  ${styledNavbarCollapse};
`;

interface IHeaderStateProps {
  user: any;
  roomState: any;
  userColor?: string;
  location: any;
  webrtc: any;
  isOnMeeting: boolean;
}

interface IHeaderDispatchProps {
  showModal: ActionCreator<AnyAction>;
}

export class Header extends React.Component<IHeaderStateProps & IHeaderDispatchProps> {
  private getCurrentRoute = () => {
    const pathname = this.props.location.pathname;

    if (pathname === '/') {
      return 'dashboard';
    }

    if (pathname.indexOf('/room') === 0) {
      return 'room';
    }

    return undefined;
  };

  private _showSettingsPanel = () => {
    this.props.showModal({
      view: SettingsPanel,
    });
  };

  private _showFeedbackPanel = () => {
    this.props.showModal({
      view: FeedbackPanel,
      width: 563,
      props: {
        user: this.props.user,
        room: this.props.roomState,
        webrtc: this.props.webrtc,
      },
    });
  };

  public render() {
    const route = this.getCurrentRoute();
    const HeaderRoute = headers[route];

    return (
      <StyledNavbar>
        <Navbar.Header>
          <Navbar.Brand>
            <div className="s2m-logo" />
          </Navbar.Brand>
        </Navbar.Header>
        {this.props.user && (
          <StyledNavbarCollapse>
            {HeaderRoute && <HeaderRoute />}
            <Nav bsStyle="pills" pullRight={true}>
              <UserMenu
                user={this.props.user}
                userColor={this.props.userColor}
                isOnMeeting={this.props.isOnMeeting}
                showSettingsPanel={this._showSettingsPanel}
                showFeedbackPanel={this._showFeedbackPanel}
                avatarImage={this.props.user.picture}
              />
            </Nav>
          </StyledNavbarCollapse>
        )}
      </StyledNavbar>
    );
  }
}

export default connect(
  (state: IStoreState) => {
    const { user } = state.auth;
    const room = state.room;
    const userColors = _get(state, 'room.state.userColors');
    const userColor = user && userColors ? userColors[user.id] : undefined;
    const { CONNECTION_STATUS } = entities.constants.webrtcConstants;

    return {
      user,

      roomState: room.state,
      webrtc: room.webrtcService,
      userColor,
      isOnMeeting: state.webphone.connectionStatus !== CONNECTION_STATUS.NONE,
      location: state.router.location,
    };
  },
  {
    showModal: appActionCreators.showModalDialog,
  }
)(Header);
