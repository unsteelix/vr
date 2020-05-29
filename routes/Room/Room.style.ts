import { IRequiredTheme } from 'src/ioc/ioc-client';

const CONTROLS_PANEL_HEIGHT = '120px';
const CONTROLS_PANEL_PADDING = '20px';
const CONTROLS_PANEL_BUTTON_SPACE_BETWEEN = '20px';

const includeClearBox = (display: string = 'inline-block', height: string = '100%') => `
  display: ${display};
  position: relative;
  left: 0;
  top: 0;
  margin: 0;
  padding: 0;
  border: 0;
  height: ${height};
  white-space: normal;
`;

export const styledBasePanle = () => `
  ${includeClearBox()};  
  flex-grow: 1;
  overflow: hidden;
`;

export const styledAsidePanel = ({ theme }: IRequiredTheme) => `
  ${includeClearBox()};
  height: 100%;
  background: ${theme.backgroundColorSecondary};
`;

export const styledCenterPanel = () => `
  ${includeClearBox('inline-flex')};
  flex-grow: 1;
  flex-direction: column;
`;

export const styledPanelContainer = () => `
  ${includeClearBox()};  
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  white-space: nowrap;
`;

export const styledControlsPanel = () => `
  ${includeClearBox('inline-flex')};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${CONTROLS_PANEL_HEIGHT};
  padding: ${CONTROLS_PANEL_PADDING} ${CONTROLS_PANEL_PADDING} 0 ${CONTROLS_PANEL_PADDING};
`;

export const styledControlsPanelGroup = () => `
  ${includeClearBox('inline-block', 'auto')};

  > *:not(:last-child) {
    margin-right: ${CONTROLS_PANEL_BUTTON_SPACE_BETWEEN};
  }
`;
