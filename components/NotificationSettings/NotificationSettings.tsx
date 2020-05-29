import * as React from 'react';
import styled from 'styled-components';

import { entities } from 'ioc/ioc-client';
import { styledContainer } from './/NotificationSettings.style';

const NotificationSettingsContainer = styled.div`
  ${styledContainer};
`;

/**
 * UI
 */
export default class NotificationSettings extends React.Component<{}> {
  private _renderChatSoundSetup() {
    const { Chat } = entities.components;

    return <Chat.NotificationSetup />;
  }

  public render() {
    return <NotificationSettingsContainer>{this._renderChatSoundSetup()}</NotificationSettingsContainer>;
  }
}
