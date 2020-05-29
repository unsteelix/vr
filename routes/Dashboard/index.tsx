import React, { MouseEvent } from 'react';
import { connect } from 'react-redux';
import { IStoreState } from 'src/client/types/store-state';
import { ActionCreator, AnyAction } from 'redux';
import appActions from 'src/client/app/appActionCreators';
import { entities } from 'src/ioc/ioc-client';
import { Panel } from 'react-bootstrap';
import styled, { ThemeProps, withTheme } from 'styled-components';

import * as BootstrapButton from 'react-bootstrap/lib/Button';
import { vrCommon } from 'src/modules/common';
import ITheme = vrCommon.client.UI.ITheme;
import { styledContainer } from './Dashboard.style';

const StyledDashboard = styled.div`
  ${styledContainer};
`;

interface IDashboardStateProps {
  user: {
    id: string;
    roomId: string;
  };
  disableRecordings: boolean;
}

interface IDashboardDispatchProps {
  sendAction: ActionCreator<AnyAction>;
  gotoRecordings: (userId: string) => any;
}

export class Dashboard extends React.Component<IDashboardStateProps & IDashboardDispatchProps & ThemeProps<ITheme>> {
  private _joinMyRoom = (evt: MouseEvent<BootstrapButton>) => {
    this.props.sendAction(
      appActions.createJoinRoom(this.props.user.id, false, (evt.target as HTMLElement).getAttribute('data-id'))
    );
  };

  private _joinTemporaryRoom = () => {
    this.props.sendAction(appActions.createJoinRoom(this.props.user.id, true));
  };

  private _gotoRecordings = () => {
    this.props.gotoRecordings(this.props.user.id);
  };

  public render() {
    const { Button } = entities.components.UI;
    const { disableRecordings } = this.props;

    return (
      <StyledDashboard className="s2m-dashboard-body">
        <Panel>
          <div>
            <img src={this.props.theme.oneTimeRoomPageLogo} />
          </div>
          <div>Start a new meeting in the default Virtual Room. No meeting data is preserved</div>
          <div>
            <Button onClick={this._joinTemporaryRoom}>MEETING IN ONE-TIME ROOM</Button>
          </div>
        </Panel>
        <Panel>
          <div>
            <img src={this.props.theme.myRoomPageLogo} />
          </div>
          <div>Start a new meeting in your own personal room</div>
          <div>
            <Button data-id={this.props.user.roomId} onClick={this._joinMyRoom}>
              MEETING IN MY ROOM
            </Button>
          </div>
        </Panel>
        {!disableRecordings && (
          <Panel>
            <div>
              <img src={this.props.theme.customizePageLogo} />
            </div>
            <div>Review and manage your meeting recordings</div>
            <div>
              <Button onClick={this._gotoRecordings}>MEETING RECORDINGS</Button>
            </div>
          </Panel>
        )}
      </StyledDashboard>
    );
  }
}

export default connect<IDashboardStateProps, IDashboardDispatchProps>(
  ({ auth }: IStoreState) => {
    const { config } = entities;

    return {
      user: auth.user,
      disableRecordings: config.project.gui.disableRecordings,
    };
  },
  {
    sendAction: appActions.sendAction,
    gotoRecordings: appActions.gotoRecordings,
  }
)(withTheme(Dashboard));
