import { rgba } from 'polished';
import { IRequiredTheme } from 'src/ioc/ioc-client';

const MARGIN = '20px';
const USER_INFO_HEIGHT = '84px';
const USER_MENU_ITEM_HEIGHT = '34px';

export const USER_INFO_AVATAR_SIZE = '45px';

const includeTextOverlow = () => `
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const styledUserMenuContainer = ({ theme }: IRequiredTheme) => `
  .btn.btn-default {
    padding: 0;
    width: 56px;
  }

  margin-right: 6px;

  .btn-default,
  .btn-default.active,
  .btn-default:active,
  .dropdown-toggle.btn-default {
    background-color: transparent !important;
    box-shadow: none;
    background: none;
    border: none;
  }

  button {
    outline: none;
    position: relative;
    background-color: transparent !important;
  }

  .caret {
    top: calc(50% - 5px);
    right: -6px;
    width: 7px;
    height: 7px;
    border-top: none;
    border-left: none;
    position: absolute;
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
    transform-origin: 50% 50%;
    transform: rotate(45deg);
  }

  .dropdown-menu {
    margin: 0;
    border: 0;
    padding: 0;
    width: 285px;
    background-color: ${theme.backgroundColorSecondary};
    box-shadow: 0 5px 14px #000000;

    li > a {
      width: 100%;
      margin: 13px 0;
      height: ${USER_MENU_ITEM_HEIGHT};
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      outline: none;
      font-size: 16px;
      padding: 0 ${MARGIN};
      color: ${theme.primaryTextColor};

      &:hover {
        & > * {
          color: ${theme.primaryTextColor};
        }
        
        background: ${theme.primaryColor};
      }
    }

    li.disabled {
      cursor: default;

      > a {
        cursor: default;
        opacity: 0.5;
        color: ${theme.primaryTextColor};

        &:hover {
          cursor: default;
          color: ${theme.primaryTextColor};
          background: transparent;
        }
      }
    }

    li:first-child {
      border-bottom: 1px solid ${theme.h1Color};

      > a {
        opacity: 1 !important;
        height: ${USER_INFO_HEIGHT};
      }
    }

    li:nth-child(n-2) {
      border-top: 1px solid ${/* tslint:disable */ rgba(theme.h1Color, 0.3) /* tslint:enable */};
    }
  }
`;

export const styledUserInfo = ({ theme }: IRequiredTheme) => `
  display: inline-block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin-left: ${MARGIN};
  width: calc(100% - ${USER_INFO_AVATAR_SIZE} - ${MARGIN});

  > div:first-child {
    font-size: 16px;
    ${includeTextOverlow()};
  }

  > div:last-child {
    font-size: 12px;
    ${includeTextOverlow()};
    color: ${theme.h1Color};
  }
`;
