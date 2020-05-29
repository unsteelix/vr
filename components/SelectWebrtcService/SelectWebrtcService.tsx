import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import {
  styledTitle,
  styledBlock,
  styledContainer,
  styledTextContainer,
  styledChoiceContainer,
  styledDropDownContainer,
  syledDisabledDropDownHelp,
  syledDisabledDropDownDescr,
  IStyledDropDownContainerProps,
} from './SelectWebrtcService.style';
import { IAppWebRTCInfo } from 'src/client/types/app';
import actionCreators from '../../app/appActionCreators';
import { isOwner as isOwnerSelector } from '../../app/selectors/';

const DROPDOWN_ID = 'webrtc-service-selelc-dropdown-menu';
const SelectWebrtcServiceContainer = styled.div`
  ${styledContainer};
`;
const StyledTextContainer = styled.span`
  ${styledTextContainer};
`;
const StyledDropDownContainer = styled.div<IStyledDropDownContainerProps>`
  ${styledDropDownContainer};
`;
const SettingsTitle = styled.div`
  ${styledTitle};
`;
const SettingsBlock = styled.div`
  ${styledBlock};
`;
const SettingsChoiceContainer = styled.div`
  ${styledChoiceContainer};
`;
const DisabledDropDownHelp = styled.div`
  ${syledDisabledDropDownHelp};
`;
const DisabledDropDownDescr = styled.div`
  ${syledDisabledDropDownDescr};
`;

const DESCRIPTIONS: Record<string, string> = {
  p2p: 'This meeting is running using peer-to-peer connection, which is optimal for meetings with up to 5 users.',
  media:
    'This meeting is running using a media server, which ensures better audio and video quality in large meetings.',
};
const TOOLTIP_DESCR: Record<string, string> = {
  guest: 'This can only be changed by the host prior to the meeting',
  owner: 'This can only be changed prior to the meeting',
};

export interface IWebRTCServiceSelectStateProps {
  isOwner: boolean;
  services: IAppWebRTCInfo[];
  serviceKey: string;
  serviceName: string;
  isDisabled: boolean;
}

export interface IWebRTCServiceSelectDispatchProps {
  onChange: (key: string) => void;
}

interface IWebRTCServiceSelectState {
  isOpened: boolean;
}

type IWebRTCServiceSelectProps = IWebRTCServiceSelectStateProps & IWebRTCServiceSelectDispatchProps;

export class SelectWebrtcService extends React.Component<IWebRTCServiceSelectProps, IWebRTCServiceSelectState> {
  private _toggleVisibility = () => {
    this.setState({ isOpened: !this.state.isOpened });
  };

  private _changeDefaultService = (inx: any) => {
    this.props.onChange(inx);
  };

  private get _dropDownHelpTooltipProps() {
    return {
      'data-tooltip': this.props.isOwner ? TOOLTIP_DESCR.owner : TOOLTIP_DESCR.guest,
      'data-tooltip-pos': 'right',
    };
  }

  private get _descriptionText() {
    if (!this.props.isDisabled) {
      return '';
    }

    if (this.props.serviceKey === '@PEER_TO_PEER') {
      return DESCRIPTIONS.p2p;
    }

    return DESCRIPTIONS.media;
  }

  constructor(props: IWebRTCServiceSelectProps) {
    super(props);

    this.state = {
      isOpened: false,
    };
  }

  public render() {
    const { isDisabled, services, serviceName } = this.props;
    const disabled = services.length < 2 || isDisabled;
    const bttnProps = {};

    return (
      <SelectWebrtcServiceContainer>
        <SettingsBlock>
          <SettingsTitle>Media server</SettingsTitle>
          <SettingsChoiceContainer>
            <StyledDropDownContainer disabled={disabled}>
              <DropdownButton
                {...bttnProps}
                id={DROPDOWN_ID}
                disabled={disabled}
                title={
                  <React.Fragment>
                    <StyledTextContainer>{serviceName}</StyledTextContainer>
                  </React.Fragment>
                }
                open={this.state.isOpened}
                onToggle={this._toggleVisibility}
                onSelect={this._changeDefaultService}
              >
                {services.map((item: IAppWebRTCInfo, inx: number) => (
                  <MenuItem key={item.key} value={item.key} eventKey={inx} active={item.name === serviceName}>
                    <span>{item.title}</span>
                  </MenuItem>
                ))}
              </DropdownButton>
            </StyledDropDownContainer>
            {isDisabled && <DisabledDropDownHelp {...this._dropDownHelpTooltipProps}>?</DisabledDropDownHelp>}
          </SettingsChoiceContainer>
          <DisabledDropDownDescr>{this._descriptionText}</DisabledDropDownDescr>
        </SettingsBlock>
      </SelectWebrtcServiceContainer>
    );
  }
}

export default connect<IWebRTCServiceSelectStateProps, IWebRTCServiceSelectDispatchProps>(
  (state: any) => {
    const isOwner = isOwnerSelector(state);
    const isInTheRoom = !!(state.room as any).state.id;
    const isActiveSession = isInTheRoom && !!(state.room as any).webrtcService.sessionId;
    const { services, selectedServiceInx } = state.app.webrtcConfig;
    const settingsWebrtcServiceName = services[selectedServiceInx].name;
    const serviceNameSelected =
      (isInTheRoom ? (state.room as any).webrtcService.serviceName : services[selectedServiceInx].name) ||
      settingsWebrtcServiceName; // backward compatibility
    const serviceInfo = services.filter((item: IAppWebRTCInfo) => item.name === serviceNameSelected)[0];

    return {
      isOwner,
      isDisabled: isActiveSession || !isOwner,
      services,
      serviceKey: serviceInfo.name,
      serviceName: serviceInfo.title,
    };
  },
  {
    // TODO: try to remove 'as any', here is 'unknown' TS error
    onChange: actionCreators.appChangeWebrtcService as any,
  }
)(SelectWebrtcService);
