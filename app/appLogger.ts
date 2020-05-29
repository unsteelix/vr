type GetStateFunc = () => any;
type DispatchLogActionFunc = (action: any) => void;

const delayedMessages: any[] = [];

const doLog = (dispatchLog: DispatchLogActionFunc, args: any[]) => {
  const moduleName = args.length === 2 ? args[0] : '';

  // the name of this variable is very important (don't change it)!
  const message = args.length === 2 ? args[1] : args[0];

  // don't show action in local store
  dispatchLog({ moduleName, message });
};

export default (getState: GetStateFunc, dispatchLog: DispatchLogActionFunc) => (...args: any[]) => {
  const state: any = getState();

  if (state.auth && state.auth.user) {
    if (delayedMessages.length) {
      delayedMessages.forEach((prevArgs: any) => doLog(dispatchLog, prevArgs));
      delayedMessages.length = 0;
    }

    doLog(dispatchLog, args);
  } else {
    delayedMessages.push(args);
  }
};
