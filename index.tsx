import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './routes/App';
import { ConnectedRouter } from 'react-router-redux';
import { IAppConfig } from './types/IAppConfig';
import appStore from './app/store';
import { entities as clientEntries } from 'src/ioc/ioc-client';
import { entities as commonEntries } from 'src/ioc/ioc-common';
import resolveUrl from 'resolve-url';
import { UserManager } from 'ioc/ioc-auth';

const renderApp = (config: IAppConfig) => {
  clientEntries.config = config;
  commonEntries.config = config;
  const servicePath = resolveUrl(clientEntries.config.service.url, clientEntries.config.service.path);

  UserManager.configureProvider({ ...config.auth, localUrl: servicePath });

  const appContainerNode = document.getElementById('s2mVirtualRoomContainer');
  const { store, history } = appStore();

  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    appContainerNode
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const config: Partial<IAppConfig> = {};

  if ((module as any).hot) {
    // TODO:: possible this is creating conflicts on localhost debuggin!!!!!!!!!!!
    // local path to server
    config.service = {
      url: `https://${process.env.IP}:3040/`,
      path: '/',
    };
  } else {
    // config to remote service
    config.service = {
      url: `/`,
      path: '/api/v1/',
    };
  }

  fetch(`${resolveUrl(config.service.url, config.service.path)}config`)
    .then((response) => {
      return response.json();
    })
    .then((configFromServer) => {
      const CFG = {
        ...config,
        ...configFromServer,
      };

      renderApp(CFG);
    });
});
