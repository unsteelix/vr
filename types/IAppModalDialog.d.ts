export interface IAppModalDialogCommonProps {
  onHide?: () => void;
}

export interface IAppModalDialogDefinition {
  view: React.ComponentClass<IAppModalDialogCommonProps & any>;
  container?: React.ComponentClass | React.PureComponent;
  closeOnOutsideClick?: boolean;
  props?: any;
}
