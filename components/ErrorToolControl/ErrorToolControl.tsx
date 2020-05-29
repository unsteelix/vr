import React from 'react';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import { divStyle, StyledText, styledButtonClose } from './ErrorToolControl.style';

const MessageContainer = styled.div`
  ${divStyle};
`;

const LabelMes = styled.div`
  ${StyledText};
`;

const ButtonClose = styled.button`
  ${styledButtonClose};
`;

interface IErrorToolControlStateProps {
  showModal: boolean;
  message: JSX.Element;
  onClick: () => any;
}

// export interface IErrorToolControlState {
//     _showModal: boolean;
// }

export default class ErrorToolControl extends React.Component<IErrorToolControlStateProps> {
  constructor(props: any) {
    super(props);
  }

  private _onHide(): () => void {
    return null;
  }

  public render() {
    return (
      <Modal show={this.props.showModal} onHide={this._onHide}>
        <MessageContainer>
          <LabelMes>{this.props.message}</LabelMes>
          <ButtonClose onClick={this.props.onClick} />
        </MessageContainer>
      </Modal>
    );
  }
}
