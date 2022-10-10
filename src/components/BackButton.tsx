import Router from 'next/router';
import { ReactElement } from 'react';

const BackButton = (): ReactElement => (
  <button
    className="hide-mobile btn glass text-sm sm:text-base"
    onClick={() => Router.back()}
  >
    {`<`} Back
  </button>
);

export default BackButton;
