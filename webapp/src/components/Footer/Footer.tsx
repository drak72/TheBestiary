import React from "react";
import { VITE_FOOTER_COPYRIGHT, VITE_PORTFOLIO_URL } from "@src/consts";

import "@components/Footer/Footer.css";

export const Footer = () => (
  <a className="footer-link" href={VITE_PORTFOLIO_URL}>
    © {new Date().getFullYear()} {VITE_FOOTER_COPYRIGHT}. All
    Rights Reserved
  </a>
);
