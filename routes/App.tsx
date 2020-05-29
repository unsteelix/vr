import { hot } from 'react-hot-loader';
import React from 'react';
import { connect } from 'react-redux';
import { IStoreState } from '../types/store-state';
import { Route, Switch } from 'react-router';
import Dashboard from 'src/client/routes/Dashboard';
import Room from 'src/client/routes/Room';
import Recordings from './Recordings';
import Login from 'src/client/routes/Login';
import Header from 'src/client/components/Header';
import ModalDialog from 'src/client/components/ModalDialog';
import styled, { ThemeProvider } from 'styled-components';
import clientContainer, {
  entities,
  IAuthUser,
  IComponents,
  IThemes,
  IBrowser,
  IWebrtcService,
  IRequiredTheme,
} from 'src/ioc/ioc-client';
import { TYPES } from 'src/ioc/TYPES';
import { get as _get } from 'lodash';
import { isGuest as isGuestSelector } from '../app/selectors/index';
import { IAppConfig } from 'src/ioc/ioc-interfaces';

const themes = clientContainer.get<IThemes>(TYPES.Themes);
const { WebPhone, UI, Media } = clientContainer.get<IComponents>(TYPES.UI);
const browser = clientContainer.get<IBrowser>(TYPES.Browser);

const StyledApp = styled.div`
  ${({ theme }: IRequiredTheme) => `
  height: 100%;
  background-color: ${theme.backgroundColor};
  color: ${theme.fontColor};
  font-family: 'Roboto';
  .s2m-header {
    height: 70px;
  }
  .s2m-body {
    display: inline-block;
    width: 100%;
    height: calc(100% - 70px);
  }
`};
`;

const ConnectedSwitch = connect(({ router }: IStoreState) => ({
  location: router.location,
}))(Switch);

export interface IAppStateProps {
  user: IAuthUser;
  realm: string;
  isGuest: boolean;
  projectName: string;
  techSupportEMail: string;
  userMediaCheckRoute: string;
  webrtcServiceName: string;
  disableRecordings: boolean;
}

export class App extends React.Component<IAppStateProps> {
  private get _currentWebrtcService(): IWebrtcService {
    return entities.getWebrtcServiceByName(this.props.webrtcServiceName);
  }

  public render() {
    const { realm, user, isGuest } = this.props;
    const selectedTheme = _get(themes, realm, themes.defaultTheme);
    const { projectName, techSupportEMail, userMediaCheckRoute, disableRecordings } = this.props;

    return (
      <ThemeProvider theme={selectedTheme}>
        <StyledApp className="s2m-vr">
          {<Media.Devices />}
          <UI.GlobalStyles theme={selectedTheme} />
          <div className="s2m-header">
            <ConnectedSwitch>
              <Header />
            </ConnectedSwitch>
          </div>
          <div className="s2m-body">
            <ConnectedSwitch>
              {!browser.supportWebRTC && (
                <UI.BrowserNotSupported projectName={projectName} techSupportEMail={techSupportEMail} />
              )}
              <Route path={userMediaCheckRoute} component={WebPhone.UserSetup} />
              {!user && <Route component={Login} />}
              <Route path="/room/:roomId" component={Room} />
              {isGuest && <Route component={Login} />}
              {!disableRecordings && <Route path="/recordings/:userId?" component={Recordings} />}
              <Route component={Dashboard} />
            </ConnectedSwitch>
          </div>

          {this.props.user && <WebPhone.ServiceProvider service={this._currentWebrtcService} />}
          {this.props.user && <WebPhone.UserInfo user={this.props.user} />}
          <ModalDialog />
        </StyledApp>
      </ThemeProvider>
    );
  }
}

export default hot(module)(
  connect<IAppStateProps, {}>(
    (state: IStoreState) => {
      const config = clientContainer.get<IAppConfig>(TYPES.Config);
      const { services, defaultServiceInx, selectedServiceInx } = state.app.webrtcConfig;
      const userInTheRoom = !!(state.room as any).state.id;
      const isOpenedSession = userInTheRoom && (state.room as any).webrtcService.sessionId;
      const defaultWebrtcServiceName = services[defaultServiceInx].name;
      const settinsWebrtcServiceName = services[selectedServiceInx].name;
      const roomWebrtcServiceName = (state.room as any).webrtcService.serviceName || defaultWebrtcServiceName;

      return {
        user: state.auth.user,
        realm: _get(state, 'auth.tokens.realm'),
        isGuest: isGuestSelector(state),
        projectName: config.project.name,
        techSupportEMail: config.project.contacts.support,
        userMediaCheckRoute: config.project.routes.userMediaCheck,
        // if the room the new one - there no webrtc service name in the state
        webrtcServiceName: isOpenedSession
          ? roomWebrtcServiceName || settinsWebrtcServiceName
          : settinsWebrtcServiceName,
        disableRecordings: 'gui' in config.project ? config.project.gui.disableRecordings : false,
      };
    },
    () => ({})
  )(App)
);
