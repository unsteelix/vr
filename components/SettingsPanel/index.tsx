import * as React from 'react';
import { connect } from 'react-redux';
import actionCreators from '../../app/appActionCreators';
import { ActionCreator, AnyAction } from 'redux';
import resolveUrl from 'resolve-url';
import styled from 'styled-components';
import { styledButtonClose, styledMenuButton, styledModalContainer } from './settingsPanel.style';
import { IAppSettingsPanel } from 'src/client/types/app';
import { IStoreState } from 'src/client/types/store-state';
import { entities } from 'src/ioc/ioc-client';
import { isGuest as isGuestSelector, isOwner as isOwnerSelector } from 'src/client/app/selectors';
import SelectWebrtcService from '../SelectWebrtcService';
import NotificationSettings from '../NotificationSettings';

const ModalButtonTab = styled.button`
  ${styledMenuButton};
`;
const ButtonClose = styled.button`
  ${styledButtonClose};
`;
const ModalContent = styled.div`
  ${styledModalContainer};
`;

interface ITabInfo {
  title: string;
  icon: string;
  element: JSX.Element;
}

interface ISettingsPanelOwnProps {
  onHide: () => void;
}

interface ISettingsPanelStateProps {
  settingsPanel: IAppSettingsPanel;
  remoteServiceUrl: string;
  showRoomTab: boolean;
  isGuest: boolean;
  authStrategy: string;
}

interface ISettingsPanelDispatchProps {
  changeSettingsPanelTab: ActionCreator<AnyAction>;
}

type ISettingsPanelModalProps = ISettingsPanelOwnProps & ISettingsPanelStateProps & ISettingsPanelDispatchProps;

export class SettingsPanelModal extends React.Component<ISettingsPanelModalProps> {
  public static Name = 'SettingsPanelModal';

  public static SIZE = {
    width: 796,
    height: 406,
  };

  private TABS: Record<string, ITabInfo>;

  constructor(props: ISettingsPanelModalProps) {
    super(props);

    const changePasswordUrl = resolveUrl(props.remoteServiceUrl, 'change-password');
    const { WebPhone, Media, Auth } = entities.components;

    this.TABS = {
      Audio: {
        title: 'Audio',
        icon: 'headset',
        element: <Media.MediaSettingsAudio />,
      },
      Video: {
        title: 'Video',
        icon: 'videoCamera',
        element: <Media.MediaSettingsVideo />,
      },
      ...(this.props.showRoomTab
        ? {
            Room: {
              title: 'Room',
              icon: 'construct',
              element: <SelectWebrtcService />,
            },
          }
        : {}),
      Notifications: {
        title: 'Notifications',
        icon: 'user',
        element: <NotificationSettings />,
      },
      ...(props.isGuest || this.props.authStrategy !== 'any'
        ? {}
        : {
            // only permanent users can change password
            Password: {
              title: 'Security',
              icon: 'unlock',
              element: <Auth.ChangePassword statePath="auth" changePasswordUrl={changePasswordUrl} />,
            },
          }),
      PreCallTest: {
        title: 'Pre-call test',
        icon: 'speedometer',
        element: <WebPhone.PreCallTest />,
      },
    };
  }

  private hide = () => {
    this.props.onHide();
  };

  private changeTabHandler = (evt: React.SyntheticEvent) => {
    const target = evt.target as HTMLButtonElement;

    this.changeTab(target.name);
  };

  private changeTab(tab: string) {
    if (this.props.settingsPanel.currentTab !== tab) {
      this.props.changeSettingsPanelTab(tab);
    }
  }

  public componentDidMount() {
    const md: IAppSettingsPanel = this.props.settingsPanel;

    if (!this.TABS[md.currentTab]) {
      this.changeTab(Object.keys(this.TABS)[0]);
    }
  }

  public render() {
    const md: IAppSettingsPanel = this.props.settingsPanel;
    const currTab = this.TABS[md.currentTab];

    return (
      <ModalContent>
        {<ButtonClose onClick={this.hide} />}
        <ul>
          {Object.keys(this.TABS).map((tabKey: string) => {
            const tab = this.TABS[tabKey];

            return (
              <li key={tab.title} className={tabKey === md.currentTab ? 'current' : ''}>
                <ModalButtonTab name={tabKey} icon={tab.icon} onClick={this.changeTabHandler}>
                  <span>{tab.title}</span>
                </ModalButtonTab>
              </li>
            );
          })}
        </ul>
        <div>{currTab && currTab.element}</div>
      </ModalContent>
    );
  }
}

export default connect<ISettingsPanelStateProps, ISettingsPanelDispatchProps>(
  (state: IStoreState) => {
    const { service } = entities.config;
    const isGuest = isGuestSelector(state);
    const isOwner = isOwnerSelector(state);
    const userInTheRoom = !!state.room.state.id;
    const sessionIsActive = !!(state.room as any).webrtcService.sessionId;

    return {
      authStrategy: state.auth.strategy,
      settingsPanel: state.app.view.settingsPanel,
      remoteServiceUrl: resolveUrl(service.url, service.path),
      isGuest,
      showRoomTab: userInTheRoom && (isOwner ? true : sessionIsActive),
    };
  },
  {
    changeSettingsPanelTab: actionCreators.changeSettingsPanelTab,
  }
)(SettingsPanelModal);
