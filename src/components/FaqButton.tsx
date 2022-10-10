import React, { ReactElement } from 'react';

const FaqButton = (): ReactElement => {
  return <button className="btn px-5 py-2 text-sm sm:text-base">FAQ</button>;
};

export const Faq = (): ReactElement => {
  return (
    <div className="w-1/2 rounded border bg-white shadow-lg md:w-1/3"></div>
  );
};

export default FaqButton;
