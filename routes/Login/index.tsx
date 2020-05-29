import React from 'react';
import { connect } from 'react-redux';
import { IStoreState } from 'src/client/types/store-state';
import resolveUrl from 'resolve-url';
import isGuest from 'src/client/app/selectors/isGuest';
import { entities } from 'src/ioc/ioc-client';
import authActionCreators from 'src/modules/auth/src/client/actionCreators';
import { ActionCreator, AnyAction } from 'redux';
import appActions from 'src/client/app/appActionCreators';
import { UserManager } from 'ioc/ioc-auth';

interface ILoginStateProps {
  remoteServiceUrl: string;
  showGuestScreen: boolean;
  isGuest: boolean;
  loginInitParams?: ActionCreator<AnyAction>;
  loginWithOauth2?: ActionCreator<AnyAction>;
  loginWithToken?: ActionCreator<AnyAction>;
  loginGuest?: ActionCreator<AnyAction>;
  showNotification?: any;
}

export class Login extends React.Component<ILoginStateProps> {
  public componentDidMount(): void {
    UserManager.getAuthFromStorage().then((exists: boolean) => {
      if (exists) {
        const user = UserManager.getUser();

        if (user) {
          UserManager.checkSSO().then((resp: any) => {
            this.props.loginWithToken();
          });
        }
      } else {
        this.props.loginInitParams({ strategy: UserManager.AuthProvider.getStrategies()[0] });
      }
    });
  }

  public render() {
    const { LoginPage } = entities.components.Auth;

    // dont reconnect guest if he is already logged in and try to navigate to any page but /room/%id%
    // see also App.tsx for routing
    return (
      <LoginPage
        showGuestScreen={this.props.showGuestScreen}
        reconnectGuest={!this.props.isGuest && this.props.showGuestScreen}
        authParams={entities.config.auth}
        serviceParams={this.props.remoteServiceUrl}
        showNotification={this.props.showNotification}
      />
    );
  }
}

export default connect<ILoginStateProps>(
  (store: IStoreState) => {
    const { service } = entities.config;

    return {
      showGuestScreen: store.router.location.pathname.indexOf('room') > -1,
      remoteServiceUrl: resolveUrl(service.url, service.path),
      isGuest: isGuest(store),
    };
  },
  {
    loginInitParams: authActionCreators.loginInitParams,
    loginWithOauth2: authActionCreators.loginWithOauth2,
    loginWithToken: authActionCreators.loginWithToken,
    loginGuest: authActionCreators.loginGuest,
    showNotification: appActions.showNotification,
  }
)(Login);
