import { CommonIconsList } from 'src/modules/common';

export interface ITools {
  [key: string]: {
    name: string;
    icon: CommonIconsList[keyof CommonIconsList];
  };
}

// TODO Room\index.tsx must use component field with common attrs
const tools: ITools = {
  whiteboard: {
    name: 'Whiteboard',
    icon: 'brush',
  },
  codeEditor: {
    name: 'Code Editor',
    icon: 'codeEditor',
  },
  webphone: {
    name: 'Conference',
    icon: 'conference',
  },
  notepad: {
    name: 'Notepad',
    icon: 'notepad',
  },
  presentations: {
    name: 'Presentation',
    icon: 'presentation',
  },
  graph2d: {
    name: 'Graph 2D',
    icon: 'graph2d',
  },
};

export default tools;
