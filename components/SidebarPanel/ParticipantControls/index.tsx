import React from 'react';
import styled from 'styled-components';
import appActions from 'src/client/app/appActionCreators';
import { connect } from 'react-redux';
import { ActionCreator, AnyAction } from 'redux';
import isOwner from 'src/client/app/selectors/isOwner';
import { IStoreState } from 'src/client/types/store-state';
import SimpleToggleButton from 'src/modules/common/src/ui/components/SimpleToggleButton';
import copy from 'copy-to-clipboard';

const StyledParticipantControls = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 5px;
`;

interface IParticipantControlsDispatchProps {
  showNotification: ActionCreator<AnyAction>;
}

interface IParticipantControlsStateProps {
  isRoomOwner: boolean;
}

class ParticipantControls extends React.Component<IParticipantControlsDispatchProps & IParticipantControlsStateProps> {
  private _copyRoomLink = () => {
    copy(window.location.href);
    this.props.showNotification({ content: 'Link copied!' });
  };

  public render() {
    return (
      <StyledParticipantControls>
        <div data-tooltip="Copy Guest link" data-tooltip-pos="down">
          <SimpleToggleButton disabled={!this.props.isRoomOwner} icon="addParticipant" onClick={this._copyRoomLink} />
        </div>
        <div data-tooltip="Coming soon" data-tooltip-pos="down">
          <SimpleToggleButton disabled={true} icon="microphoneMuted" />
        </div>
        <div data-tooltip="Coming soon" data-tooltip-pos="down">
          <SimpleToggleButton disabled={true} icon="handMuted" />
        </div>
      </StyledParticipantControls>
    );
  }
}

export default connect<IParticipantControlsStateProps, IParticipantControlsDispatchProps>(
  (state: IStoreState) => {
    return {
      isRoomOwner: isOwner(state),
    };
  },
  {
    showNotification: appActions.showNotification,
  }
)(ParticipantControls);
