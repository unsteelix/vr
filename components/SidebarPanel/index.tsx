import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IStoreState } from 'src/client/types/store-state';
import { Tab, Tabs } from 'react-bootstrap';
import PaticipantControls from './ParticipantControls';
import Indicator from 'src/modules/common/src/ui/components/Indicator';
import { entities, selectors } from 'src/ioc/ioc-client';
import { ActionCreator, AnyAction, bindActionCreators } from 'redux';
import { getUserColors, isOwner } from 'src/client/app/selectors/index';
import { UserColors } from 'src/client/types/app';
import { styledPanelContainer } from './Sidebar.style';

const StyledSidebarPanel = styled.div`
  ${styledPanelContainer};
`;

const StyledTitleContainer = styled.span`
  position: relative;
`;

interface ISidebarPanelStateProps {
  isRoomOwner: boolean;
  numberOfParticipants: number;
  currentTool: string;
  numberOfUnreadMessages: number;
  userColors: UserColors;
}

interface ISidebarPanelDispatchProps {
  setAllRead: ActionCreator<AnyAction>;
}

interface ISidebarPanelState {
  currentTab: number;
}

class SidebarPanel extends React.Component<ISidebarPanelStateProps & ISidebarPanelDispatchProps> {
  public state: ISidebarPanelState = {
    currentTab: 1,
  };

  private renderChatTabTitle = () => {
    return (
      <StyledTitleContainer>
        Chat
        {this.props.numberOfUnreadMessages > 0 && <Indicator value={this.props.numberOfUnreadMessages} />}
      </StyledTitleContainer>
    );
  };

  private changeTab = (val: any) => {
    this.setState({ currentTab: val });
  };

  public componentDidUpdate() {
    if (this.state.currentTab === 2) {
      this.props.setAllRead();
    }
  }

  public render() {
    const { isRoomOwner, userColors } = this.props;
    const { Chat, WebPhone } = entities.components;

    return (
      <StyledSidebarPanel>
        <Tabs activeKey={this.state.currentTab} onSelect={this.changeTab} id="s2m-right-sidebar">
          <Tab eventKey={1} title={`Participants (${this.props.numberOfParticipants})`}>
            {isRoomOwner && <PaticipantControls />}
            {isRoomOwner && <hr />}
            <WebPhone.Participants userColors={userColors} />
          </Tab>
          <Tab eventKey={2} title={this.renderChatTabTitle()}>
            <Chat.Panel statePath="room.chat" />
          </Tab>
        </Tabs>
      </StyledSidebarPanel>
    );
  }
}

export default connect<ISidebarPanelStateProps, ISidebarPanelDispatchProps>(
  (state: IStoreState) => {
    const { numberOfUnreadMessages } = selectors.chatSelectors;

    return {
      userColors: getUserColors(state),
      isRoomOwner: isOwner(state),
      numberOfParticipants: state.room.state.participants.length,
      currentTool: state.room.state.currentTool,
      numberOfUnreadMessages: numberOfUnreadMessages(state.room.chat),
    };
  },
  (dispatch: any) => {
    const { appActionCreators } = entities;

    return {
      setAllRead: bindActionCreators(appActionCreators.setAllRead, dispatch),
    };
  }
)(SidebarPanel);
