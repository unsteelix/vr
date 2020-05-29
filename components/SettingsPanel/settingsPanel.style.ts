/* tslint:disable:no-magic-numbers */

import { IRequiredTheme, ITheme, commonIcons as icons } from 'src/ioc/ioc-client';
import { lighten, transparentize } from 'polished';
import { css } from 'styled-components';

const menuWidth = '182px';
const bttnSize = '30px';
const bttnTabHeight = '40px';
const splitWidth = '2px';
const splitColor = '#575757';
const lightenValue = 0.02;

const includeModalPanelCommon = () => `
  display: inline-block;
  vertical-align: top;
  height: 100%;
  padding: 0;
  margin: 0;
  border: 0;
`;

const includeEmptyButton = () => css`
  border: 0;
  margin: 0;
  padding: 0;
  outline: none;
  background: transparent;
`;

export const styledButtonClose = () => `
  ${includeEmptyButton};
  top: 10px;
  right: 10px;
  cursor: pointer;
  position: absolute;
  display: inline-block;
  width: ${bttnSize};
  height: ${bttnSize};
  border: none;
  background: transparent;
  outline: none;

  &:before {
    color: #fff;
    font-size: 20px;
    vertical-align: middle;
    display: inline-block;
    content: ${icons.code.close};
    font-family: ${icons.fontFamily};
  }
`;

const positionTop: Record<string, string> = {
  unlock: '-2px',
  headset: '-1px',
  videoCamera: '-1px',
};

const positionLeft: Record<string, string> = {
  videoCamera: '1px',
};

const includePositionTop = (icon: string): string => {
  const pos: string = positionTop[icon];

  return pos ? `top: ${pos};` : '';
};

const includePositionLeft = (icon: string): string => {
  const pos: string = positionLeft[icon];

  return pos ? `left: ${pos};` : '';
};

export const styledMenuButton = (props: { icon: string }) => css`
  ${includeEmptyButton};
  width: 100%;
  height: 100%;
  cursor: pointer;
  text-align: left;
  padding-left: 34px;
  border: 0;
  outline: 0;
  background: transparent;

  &:before {
    font-size: 20px;
    vertical-align: middle;
    display: inline-block;
    width: 26px;
    text-align: center;
    font-family: ${icons.fontFamily};
  }

  &:before {
    position: relative;
    content: ${(icons.code as any)[props.icon]};
    ${includePositionTop(props.icon)};
    ${includePositionLeft(props.icon)};
  }

  > span {
    margin-left: 6px;
    display: inline-block;
  }

  > * {
    pointer-events: none;
    vertical-align: middle;
  }
`;

const includedStyledForm = (theme: ITheme) => css`
  .form-group {
    display: flex;
    align-items: center;        
    
    label {      
      font-weight: inherit;
      color: ${theme.fontColor}
    }
    
    div {
      padding-left: 0
    }

    .form-control {       
      border-color: ${theme.primaryTextColor}  
    
      &:focus {
        border-color: ${theme.buttonDefaultColor}
      }                  
    }
    
    .help-block {
      padding: 5px;
      font-size: 9px;
      margin: 0;
    }
    
    &.has-error {
      .form-control {
        border-color: ${theme.buttonWarningColor};       
      }
                     
      .help-block {    
        color: ${theme.buttonWarningColor}
        background-color: ${transparentize(0.8, theme.buttonWarningColor)};          
      }
    }
    
    &.has-success {
      .help-block {
        color: ${theme.primaryTextColor}
        background-color: ${transparentize(0.35, theme.buttonDefaultColor)};
      }
    }
  }      
`;

export const styledModalContainer = ({ theme }: IRequiredTheme) => css`
  font-size: 15px;
  height: 100%;

  > ul {
    ${includeModalPanelCommon()};
    padding: 20px 0;
    overflow: hidden;
    list-style-type: none;
    width: ${menuWidth};
    border-right: ${splitWidth} solid ${splitColor};
    > li {
      color: #fff;
      margin-bottom: 2px;
      height: ${bttnTabHeight};
      &.current {
        background-color: ${lighten(lightenValue, theme.primaryColor)};
      }
    }
  }

  > div {
    ${includeModalPanelCommon()};
    width: calc(100% - ${menuWidth});
  }

  ${includedStyledForm(theme)};
`;
