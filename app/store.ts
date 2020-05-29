import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore, Reducer } from 'redux';
import { createBrowserHistory } from 'history';
import io from 'socket.io-client';
import appReducer from './appReducer';
import { IAPIAction } from 'src/types/API-types';
import resolveUrl from 'resolve-url';
import { TYPES } from 'src/ioc/TYPES';
import clientContainer from 'src/ioc/ioc-client';
import { appActionCreators, IAppReduxMiddleware } from 'src/ioc/ioc-common';
import { IAppConfig, ILoggerAPI } from 'src/ioc/ioc-interfaces';
import { loggerCreator } from 'src/modules/logger/src/common';
import appLogerCreator from './appLogger';
import { appReporterCreate, appReporterReset } from './appReporter';

const appReducers = clientContainer.get<Reducer>(TYPES.AppReducers);
const middlewares = clientContainer.get<IAppReduxMiddleware[]>(TYPES.ReduxMiddleware);

export default () => {
  const config = clientContainer.get<IAppConfig>(TYPES.Config);

  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const remoteUrl = resolveUrl(config.service.url, config.service.path);

  const socket = io(remoteUrl, {
    path: config.service.path + 'ws',
    autoConnect: false,
    reconnectionDelayMax: 1000,
    timeout: 3000,
  });
  const history = createBrowserHistory();
  const bindedMiddlewares = middlewares.map((moduleMiddleware: IAppReduxMiddleware) => moduleMiddleware(socket));
  const store = createStore(
    combineReducers({
      app: appReducer(config),
      router: routerReducer,
      ...appReducers,
    }),
    composeEnhancers(applyMiddleware(routerMiddleware(history), ...bindedMiddlewares))
  );
  const dispatchActionFromSocket = (data: IAPIAction) => store.dispatch(data.action);

  socket.on('connect', () => {
    socket.on('action', dispatchActionFromSocket);
  });

  socket.on('disconnect', () => {
    socket.off('action', dispatchActionFromSocket);
    appReporterReset();
  });

  // bind logger to transport
  const appLogger = loggerCreator((actionCreator) => {
    const getState = () => store.getState();
    const dispatchLog = (data: any) => store.dispatch(appActionCreators.sendAction(actionCreator(data), false));

    return appLogerCreator(getState, dispatchLog);
  });

  // bind reporter user info to transport
  store.subscribe(
    appReporterCreate(
      // get state function
      () => store.getState(),
      // action dispacher callback
      (action: any) => store.dispatch(appActionCreators.sendAction(action))
    )
  );

  // apply builded function to container
  clientContainer.bind<ILoggerAPI>(TYPES.Logger).toConstantValue(appLogger);
  clientContainer.bind<SocketIOClient.Socket>(TYPES.Socket).toConstantValue(socket);

  window.onbeforeunload = () => {
    socket.close();
  };

  return { store, history };
};
