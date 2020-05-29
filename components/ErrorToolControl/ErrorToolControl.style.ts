import { commonIcons as icons } from 'src/ioc/ioc-client';

const bttnSize = '16px';

export const divStyle = () => `
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #ffd54f;
  width: 600px;
  height: 50px;
`;

export const StyledText = () => `
  font-size: 20px;
  color: black;
`;

export const styledButtonClose = () => `
margin: 0 3%;
position: absolute;
  right: 0;
  height: 100%;
// width: ${bttnSize};
// height: ${bttnSize};

border: none;
background: transparent;
outline: none;

&:before {
  color: black;
  font-size: ${bttnSize};
  content: ${icons.code.close};
  font-family: ${icons.fontFamily};
}
`;
