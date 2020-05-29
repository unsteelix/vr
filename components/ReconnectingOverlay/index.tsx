import React from 'react';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IStoreState } from 'src/client/types/store-state';
import { entities } from 'src/ioc/ioc-client';

interface IReconnectingStateProps {
  statusNotConnected: boolean;
}

const StyledText = styled.div`
  padding: 10px 70px;
  background: #ffd54f;
  border-radius: 1px;
  font-size: 20px;
  white-space: nowrap;
  color: black;
  user-select: none;
`;

class ReconnectingOverlay extends React.Component<IReconnectingStateProps> {
  public state = {
    showPopup: true,
  };

  private unloadListener = () => {
    this.setState({
      showPopup: false,
    });
  };

  public componentDidMount() {
    window.addEventListener('beforeunload', this.unloadListener);
  }

  public componentWillUnmount(): void {
    window.removeEventListener('beforeunload', this.unloadListener);
  }

  private onHide(): () => void {
    return null;
  }

  public render() {
    const showModal = this.state.showPopup && this.props.statusNotConnected;

    return (
      <Modal show={showModal} onHide={this.onHide}>
        <StyledText>You are disconnected from the server. Reconnecting...</StyledText>
      </Modal>
    );
  }
}

export default connect<IReconnectingStateProps>((state: IStoreState) => ({
  statusNotConnected: state.connection.status !== entities.constants.connection.CONNECTION_STATUS.CONNECTED,
}))(ReconnectingOverlay);
