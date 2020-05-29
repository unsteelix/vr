import { IRequiredTheme } from 'src/ioc/ioc-client';
import styled, { css } from 'styled-components';
import { Modal } from 'react-bootstrap';

export interface IModalViewProps extends IRequiredTheme {
  width: number;
  height: number;
}

const styledModalContainer = ({ width, height }: IModalViewProps) => css`
  display: flex !important;
  align-items: center;
  justify-content: center;

  &.modal {
    padding: 0 !important;
    overflow: hidden;

    .modal-dialog {
      border: 0;

      width: ${width ? `${width}px;` : ''};
      height: ${height ? `${height}px;` : ''};
    }

    .modal-content {
      height: 100%;
    }

    .modal-body {
      padding: 0;
      height: 100%;
    }
  }
`;

const styledModalBody = css`
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  color: ${(props) => props.theme.primaryTextColor};
  font-size: 18px;
`;

export const ModalContainer = styled(Modal)<IModalViewProps>`
  ${styledModalContainer};
`;
export const ModalBody = styled(Modal.Body)`
  ${styledModalBody};
`;
