import React from "react";
import content from "../content.json";

function Footer({ copyright }) {
  return (
    <footer className="responsive-padding flex flex-col items-center justify-center">
      <p>{copyright}</p>
    </footer>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      navLinks: content.navLinks,
      hero: content.hero,
      features: content.features,
      useCases: content.useCases,
      copyright: content.copyright,
    },
  };
};

export default Footer;
