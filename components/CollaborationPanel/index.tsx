import React from 'react';
import styled from 'styled-components';
import SimpleToggleButton from 'src/modules/common/src/ui/components/SimpleToggleButton';
import appActions from 'src/client/app/appActionCreators';
import PRESENT_TOOLS, { ITools } from 'src/client/components/PRESENT_TOOLS';
import { connect } from 'react-redux';
import { ActionCreator, AnyAction } from 'redux';
import isOwner from 'src/client/app/selectors/isOwner';
import { IStoreState } from 'src/client/types/store-state';
import { entities } from 'src/ioc/ioc-client';

const StyledCollaborationPanel = styled.div`
  text-align: center;
  padding-top: 10px;

  & > div {
    margin-bottom: 15px;
  }
`;

interface ICollaborationPanelDispatchProps {
  sendRoomAction: ActionCreator<AnyAction>;
}

interface ICollaborationPanelStateProps {
  isRoomOwner: boolean;
  currentTool: string;
  activeTools: string[];
}

export class CollaborationPanel extends React.Component<
  ICollaborationPanelDispatchProps & ICollaborationPanelStateProps
> {
  private setActiveTool = (tool: string) => {
    if (this.props.currentTool === tool) {
      this.props.sendRoomAction(appActions.setCurrentTool(PRESENT_TOOLS.webphone.name));
    } else {
      this.props.sendRoomAction(appActions.setCurrentTool(tool));
    }
  };

  private generateToolTooltip = (tool: ITools[keyof ITools]) => {
    return `${tool.name} is currently ${this.props.currentTool === tool.name ? 'active ' : 'inactive'}`;
  };

  private renderTools = () => {
    return this.props.activeTools.map((key) => {
      const tool = PRESENT_TOOLS[key];

      if (!tool) {
        return null;
      }

      const currentTool = this.props.currentTool || PRESENT_TOOLS.webphone.name;
      const tooltip = {
        'data-tooltip': this.generateToolTooltip(tool),
        'data-tooltip-pos': 'right',
      };

      return (
        <SimpleToggleButton
          disabled={!this.props.isRoomOwner}
          icon={tool.icon}
          key={tool.name}
          tooltip={tooltip}
          active={currentTool === tool.name}
          onClick={this.setActiveTool.bind(this, tool.name)}
        />
      );
    });
  };

  public render() {
    return <StyledCollaborationPanel>{this.renderTools()}</StyledCollaborationPanel>;
  }
}

export default connect<ICollaborationPanelStateProps, ICollaborationPanelDispatchProps>(
  (state: IStoreState) => {
    const { activeTools } = entities.config.project;

    return {
      activeTools,
      isRoomOwner: isOwner(state),
      currentTool: state.room.state.currentTool || PRESENT_TOOLS.webphone.name,
    };
  },
  {
    sendRoomAction: appActions.sendRoomAction,
  }
)(CollaborationPanel);
