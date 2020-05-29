import { IRequiredTheme } from 'src/ioc/ioc-client';

const TABS_HEIGHT = '40px';

export const styledPanelContainer = ({ theme }: IRequiredTheme) => `
  height: 100%;

  #s2m-right-sidebar {
    height: 100%;
  }

  .nav-tabs {
    border-bottom: 0;
    margin-bottom: 1px;
    display: flex;
    height: ${TABS_HEIGHT};

    li {                
      width: 100%;
      text-align: center;
    
      a:focus {
        outline:0;
      }
    
      a {
        background-color: ${theme.backgroundColorThird};
        color: ${theme.buttonOffColor}
        border-radius: 0;
        border: 0;          
      }      
      
      &.active a, &.hover a {
        border: 0;
        color: ${theme.fontColor}
        background-color: inherit;
      }      
    }
  }

  .tab-content {
    height: calc(100% - ${TABS_HEIGHT});

    > div {
      height: 100%;
    }
  }
`;
