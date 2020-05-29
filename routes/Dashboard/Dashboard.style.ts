import { IRequiredTheme } from 'src/ioc/ioc-client';

export const styledContainer = ({ theme }: IRequiredTheme) => `
  height: 100%;
  display: flex;
  justify-content: center;
  padding-top: 90px;
  .panel {
    padding: 30px;
    border: none;
    border-radius: 0;
    background-color: ${theme.backgroundColorSecondary};
    margin-right: 30px;
    width: 340px;
    height: 380px;
    text-align: center;

    div {
      display: flex;
      margin-bottom: 40px;
      justify-content: center;
      img {
        width: 215px;
        height: 140px;
      }
    }

    button {
      width: 250px;
    }
  }
`;
