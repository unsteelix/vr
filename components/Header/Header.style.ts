import { IRequiredTheme } from 'src/ioc/ioc-client';

export const styledNavbarCollapse = () => `
  & > .btn {
    margin-right: 20px;
  }
`;

export const styledNavbar = ({ theme }: IRequiredTheme) => `
  background-color: ${theme.backgroundColorSecondary};
  box-shadow: 0px 2px 8px 0 rgba(0, 0, 0, 0.4);
  height: 100%;
  border: none;
  margin-bottom: 0;
  border-radius: 0;
  z-index: 1001;
  position: relative;

  &.navbar-collapse {
    padding: 0;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;

    & > .navbar-header {
      width: 200px;
      & > * {
        width: 100%;
      }

      .s2m-logo {
        background-image: url(${theme.logo});
        background-repeat: no-repeat;
        background-size: contain;
        background-position: left center;
      }
    }

    & > .collapse {
      width: 100%;
    }
    & > div {
      display: flex !important;
      align-items: center;
      justify-content: flex-end;
      .navbar-brand {
        height: auto;
      }
      .navbar-nav:not(:last-child) {
        margin-right: 25px;
      }
      .vertical-border {
        margin: 0 25px 0 0;
        width: 2px;
        height: 100%;
        background: ${theme.backgroundColor};
      }
    }
  }
`;
