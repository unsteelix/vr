import React from 'react';
import { entities } from 'src/ioc/ioc-client';
import styled from 'styled-components';

const { Recording, Notification } = entities.components;

const RecordingsPage = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const Recordings: React.FunctionComponent = (props: any) => {
  const { config } = entities;
  const disableRecordings = 'gui' in config.project ? config.project.gui.disableRecordings : false;
  if (disableRecordings) {
    window.location.href = config.project.urls.home;
    return <></>;
  } else {
    return (
      <React.Fragment>
        {!disableRecordings && (
          <RecordingsPage>
            <Recording.Recordings {...props} />
            <Notification.NotificationContainer />
          </RecordingsPage>
        )}
      </React.Fragment>
    );
  }
};

export default Recordings;
