import React from 'react';
import styled from 'styled-components';
import { IRequiredTheme } from 'src/ioc/ioc-client';

const Splitter = styled.div`
  ${({ theme }: IRequiredTheme) => `
  width: 1px;
  height: 34px;
  border: 1px;
  margin-right: 18px;
  margin-left: 5px;
  background-color: ${theme.buttonDisabledColor};

  &:first-child {
    display: none;
  }
`};
`;

export default () => <Splitter />;
