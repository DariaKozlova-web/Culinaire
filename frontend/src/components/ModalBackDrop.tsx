import { type ReactNode } from "react";
import { createPortal } from "react-dom";

interface IProps {
  children?: ReactNode;
  backDropAction?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
}
export const ModalWindowBackdrop = ({ children, backDropAction }: IProps) => {
  const modalBackdropRoot = document.querySelector(
    "#modal-backdrop-root",
  ) as HTMLDivElement;

  const handleBackDropCLick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (backDropAction) {
      backDropAction(event);
    }
  };

  return createPortal(
    <div
      className="bg-Black/60 fixed top-0 right-0 bottom-0 left-0 z-40"
      onClick={handleBackDropCLick}
    >
      {children}
    </div>,
    modalBackdropRoot,
  );
};
