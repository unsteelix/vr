import React from 'react';
import actionCreators from '../../app/appActionCreators';
import { ActionCreator, AnyAction } from 'redux';
import { IStoreState } from '../../types/store-state';
import { connect } from 'react-redux';
import { ModalContainer, ModalBody } from './ModalDialog.style';
import { IAppModalDialogDefinition } from 'src/client/types/IAppModalDialog';

type ModalDialogBackdrop = 'static' | boolean;

interface IModalDialogStateProps {
  modal?: IAppModalDialogDefinition;
}

interface IModalDialogDispatchProps {
  onHide: ActionCreator<AnyAction>;
}

type IModalDialogProps = IModalDialogStateProps & IModalDialogDispatchProps;

export class ModalDialog extends React.Component<IModalDialogProps> {
  public render() {
    const { modal, onHide } = this.props;

    if (!modal) {
      return null;
    }

    const ModalView = modal.view;
    const containerSize = (ModalView as any).SIZE || ({} as any);
    const backdrop: ModalDialogBackdrop = modal.closeOnOutsideClick === false ? 'static' : true;
    const containerProps = { onHide, backdrop, show: true };
    const modalProps = {
      onHide,
      ...modal.props,
      container: modal.container,
    };

    return (
      <ModalContainer {...containerProps} {...containerSize}>
        <ModalBody>
          <ModalView {...modalProps} />
        </ModalBody>
      </ModalContainer>
    );
  }
}

export default connect<IModalDialogStateProps, IModalDialogDispatchProps>(
  (state: IStoreState) => ({
    modal: state.app.view.modalDialog,
  }),
  {
    onHide: actionCreators.hideModalDialog,
  }
)(ModalDialog);
