import React, { useState } from 'react';

type FaqContentProps = {
  visible: boolean;
  onClose: VoidFunction;
  content: React.ReactNode;
};

export const FaqContent: React.FC<FaqContentProps> = ({
  visible,
  onClose,
  content,
}) => {
  const handleOnClose = (e: any) => {
    if (e.target.id !== `container`) return;
    onClose();
  };
  if (!visible) return null;
  return (
    <div
      className="w-100 fixed inset-0 z-30 flex items-start bg-transparent p-4 md:items-center md:justify-center"
      id="container"
      onClick={(e) => handleOnClose(e)}
      data-theme
    >
      <div className="relative max-w-full rounded-md bg-zinc-900 p-2 px-5 pb-5 md:max-w-lg">
        <h1 className="my-5 rounded py-3 text-center text-xl font-bold underline underline-offset-8">
          FAQ
        </h1>
        {content !== null && <>{content}</>}
        <button
          className="btn btn-square absolute top-4 right-4"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

type FaqButtonProps = {
  content: React.ReactNode;
};

const FaqButton: React.FC<FaqButtonProps> = ({ content }) => {
  const [showModal, setShowModal] = useState(false);
  const handleOnClose = () => setShowModal(false);
  return (
    <div>
      <button
        className="btn btn-outline btn-circle px-5 py-2 text-sm font-bold sm:text-base"
        onClick={() => setShowModal(true)}
      >
        ?
      </button>
      <FaqContent
        visible={showModal}
        onClose={handleOnClose}
        content={content}
      />
    </div>
  );
};
export default FaqButton;
