const Footer = () => (
  <div className="relative w-full">
    <img
      id="bottom-background"
      className="-z-20 h-16 w-full bg-cover opacity-60"
      src={`/bottom-wave.svg`}
    />
    <p className="absolute right-4 bottom-4">
      Created by{` `}
      <a className="link text-white" href="https://esteetey.dev/">
        Estee Tey
      </a>
      {` `}
    </p>
  </div>
);

export default Footer;
