import React, { ReactElement, useState } from 'react';
type Props = {
  visible: boolean;
  onClose: VoidFunction;
  data: React.ReactNode;
};

export const Faq: React.FC<Props> = ({ visible, onClose, data }) => {
  const handleOnClose = (e: any) => {
    if (e.target.id !== `container`) return;
    onClose();
  };

  if (!visible) return null;
  return (
    <div
      className="w-100 fixed inset-0 z-20 flex items-center justify-center"
      id="container"
      onClick={(e) => handleOnClose(e)}
      data-theme
    >
      <div className="max-w-sm rounded bg-black bg-opacity-30 p-2 px-5 pb-5 backdrop-blur-sm md:max-w-lg">
        <h1 className="btn-primary my-5 rounded py-3 text-center font-bold">
          FAQ
        </h1>
        {data !== null && <>{data}</>}
      </div>
    </div>
  );
};

type props = {
  data: React.ReactNode;
};
const FaqButton: React.FC<props> = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const handleOnClose = () => setShowModal(false);
  return (
    <div className="absolute right-2 top-2">
      <button
        className="btn px-5 py-2 text-sm font-bold sm:text-base"
        onClick={() => setShowModal(true)}
      >
        ?
      </button>
      <Faq visible={showModal} onClose={handleOnClose} data={data} />
    </div>
  );
};
export default FaqButton;
