import React from 'react';
import styled from 'styled-components';
import imageUrl from './audience.svg';

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 100%;
  flex-flow: row wrap;
`;

const BodyContainer = styled.div`
  width: 100%;
  text-align: center;

  > p {
    margin-top: 26px;
    font-size: 20px;
  }
`;

export default () => (
  <PageContainer>
    <BodyContainer>
      <img src={imageUrl} />
      <p>Sorry, all the seats in this meeting are taken</p>
    </BodyContainer>
  </PageContainer>
);
