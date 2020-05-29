import { IRequiredTheme, commonIcons as icons } from 'src/ioc/ioc-client';

const zIndex = 100;
const baseHeight = '30px';
const borderSize = '1px';
const defaultPadding = '0 6px';
const containerWidth = `230px`;
const containerHeight = `calc(100% - 2 * ${borderSize})`;

const includeOverflowText = () => `
  width: 100%;
  overflow: hidden;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const styledContainer = () => `
  border: 0;
  padding: 0;
  margin: 10px 0;
  width: 100%;
  height: calc(100% - 20px);
  color: #fff;
  vertical-align: top;
  display: inline-block;

  > hr {
    border: none;
    height: 25px;
    width: 100%;
    margin: 0;
    background: transparent;
    text-align: center;

    &:before {
      display: inline-block;
      width: 70%;
      height: 2px;
      content: '';
      position: relative;
      top: 10px;
      background: linear-gradient(to right, rgba(51,51,51,1) 0%,rgba(0,0,0,0.24) 50%,rgba(51,51,51,1) 100%);
    }
  }
}
`;

export const styledTitle = () => `
  font-weight: bold;
  margin-bottom: 14px;
  margin-top: 20px;
`;

export const styledBlock = () => `
  border: 0;
  margin: 0;
  padding: 0 34px;
`;

export const styledChoiceContainer = () => `
  width: 100%;
  height: 30px;
  vertical-align: middle;
  align-items: center;
  display: flex;
`;

export const styledTextContainer = () => `
  ${includeOverflowText()};
`;

export interface IStyledDropDownContainerProps extends IRequiredTheme {
  hasError?: boolean;
  disabled?: boolean;
}

export const styledDropDownContainer = ({ theme, disabled = false }: IStyledDropDownContainerProps) => `
  padding: 0;
  display: inline-block;
  box-sizing: content-box;
  width: ${containerWidth};
  height: ${containerHeight};
  background: ${theme.backgroundColorSecondary};
  border: ${borderSize} solid ${disabled ? theme.buttonDisabledColor : theme.primaryColor};
  position: relative;

  &.empty {
    border: 1px solid #faf9f5;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    opacity: 0.6;
    user-select: none;
    pointer-events: none;

    > span {
      text-align: center;
      color: #faf9f5;
    }
  }

  > .dropdown {
    width: 100%;
    height: 100%;

    > button {
      &.btn[disabled] {
        opacity: 1;
      }

      padding: 0;
      width: 100%;
      height: 100%;
      border: none;
      text-align: left;
      display: inline-flex;
      align-items: center;
      background: transparent;
      color:  ${theme.primaryTextColor};

      &.dropdown-toggle,
      &.dropdown-toggle.btn-default:focus,
      &.dropdown-toggle.btn-default:hover {
        color:  ${theme.primaryTextColor};
        border: none;
        background-color: transparent;
      }

      > span:not(.caret) {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        padding: ${defaultPadding};
        color: ${disabled ? theme.buttonDisabledColor : theme.primaryTextColor};
      }

      > span.caret {
        margin-left: 0;
        border: 0;
        width: 24px;
        position: relative;
        display: ${disabled ? 'none' : 'inline-flex'};
        align-items: center;

        &:before {
          font-size: 26px;
          color: ${theme.primaryColor};
          content: ${icons.code.arrowDown};
          font-family: ${icons.fontFamily};
        }
      }
    }

    > .dropdown-menu {
      min-width: 100%;
      padding: 0;
      border-radius: 0;
      box-shadow: none;
      z-index: ${zIndex + 10};
      border: ${borderSize} solid ${theme.primaryColor};
      background-color: ${theme.backgroundColorSecondary};

      > li {
        height: ${baseHeight};

        > a {
          height: ${baseHeight};
          line-height: ${baseHeight};
          padding: ${defaultPadding};
          color: ${theme.primaryTextColor};
          display: inline-block;
          ${styledTextContainer()};
  
          &:hover {
            background-color: ${theme.primaryColor};
          }
        }
      }
    }
  }
`;

const dddHelpSize = 16;

export const syledDisabledDropDownHelp = ({ theme }: IRequiredTheme) => `
  display: inline-flex;
  position: relative;
  border-radius: 50%;
  width: ${dddHelpSize}px;
  height: ${dddHelpSize}px;
  background-color: ${theme.primaryTextColor};
  margin-left: 10px;
  font-size: 11px;
  font-weight: bold;
  font-family: Arial;
  align-items: center;
  justify-content: center;
  color: ${theme.backgroundColorSecondary};
`;

export const syledDisabledDropDownDescr = () => `
  margin-top: 10px;
  font-size: 13px;
  width: 500px;
`;
