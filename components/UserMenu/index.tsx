import React from 'react';
import styled from 'styled-components';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { entities, IRequiredTheme } from 'src/ioc/ioc-client';
import { styledUserInfo, styledUserMenuContainer, USER_INFO_AVATAR_SIZE } from './UserMenu.style';

const UserInfo = styled.div`
  ${styledUserInfo};
`;
const UserMenuContainer = styled.div`
  ${styledUserMenuContainer};
`;
const LogoutText = styled.span`
  ${({ theme }: IRequiredTheme) => `
  color: ${theme.primaryColor};
`};
`;

interface IUserMenuProps {
  user: any;
  userColor?: string;
  isOnMeeting: boolean;
  showSettingsPanel: () => void;
  showFeedbackPanel: () => void;
  avatarImage?: string;
}

interface IUserMenuState {
  isOpened: boolean;
}

export class UserMenu extends React.Component<IUserMenuProps, IUserMenuState> {
  constructor(props: IUserMenuProps) {
    super(props);

    this.state = { isOpened: false };
  }

  private _toggleVisibility = () => {
    this.setState({ isOpened: !this.state.isOpened });
  };

  private _showSettings = () => {
    this.props.showSettingsPanel();
    this._toggleVisibility();
  };

  private _showFeedbackPanel = () => {
    this.props.showFeedbackPanel();
  };

  private _getTitle = (): string => {
    return this.props.isOnMeeting ? 'This meeting is already configured' : 'Show settings';
  };

  public render() {
    const { user, userColor } = this.props;
    const { UI, Auth } = entities.components;

    return (
      <UserMenuContainer>
        <DropdownButton
          id="user-menu"
          title={
            <React.Fragment>
              <UI.UserAvatar displayName={user.displayName} userColor={userColor} size="34px" src={this.props.avatarImage}/>
            </React.Fragment>
          }
          open={this.state.isOpened}
          onToggle={this._toggleVisibility}
        >
          <MenuItem disabled={true}>
            <UI.UserAvatar displayName={user.displayName} userColor={userColor} size={USER_INFO_AVATAR_SIZE} />
            <UserInfo>
              <div>{user.displayName}</div>
              <div>{user.email}</div>
            </UserInfo>
          </MenuItem>
          <MenuItem onClick={this._showSettings} title={this._getTitle()}>
            Settings
          </MenuItem>
          <MenuItem onClick={this._showFeedbackPanel}>Feedback</MenuItem>
          <Auth.LogoutButton component={MenuItem} onClick={this._toggleVisibility}>
            <LogoutText>LOG OUT</LogoutText>
          </Auth.LogoutButton>
        </DropdownButton>
      </UserMenuContainer>
    );
  }
}

export default UserMenu;
