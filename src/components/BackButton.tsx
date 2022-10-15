import Router from 'next/router';
import { ReactElement } from 'react';

const BackButton = (): ReactElement => (
  <button
    className="btn glass text-sm sm:text-base"
    onClick={() => Router.back()}
  >
    {`<`} Back
  </button>
);

export default BackButton;
