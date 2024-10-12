"use client";
import "@components/css/Footer.css";

export const Footer = () => (
  <a className="footer-link" href={import.meta.env.VITE_PORTFOLIO_URL ?? "#"}>
    © {new Date().getFullYear()} {import.meta.env.VITE_FOOTER_COPYRIGHT}. All
    Rights Reserved
  </a>
);
