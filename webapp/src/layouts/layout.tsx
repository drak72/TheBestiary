import * as React from "react";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer/Footer";
import { ParticleBackground } from "@components/Particles";
import "./layout.css";

export type Entity = {
  id?: string;
  date?: string;
  subject?: string;
  adjectives?: string;
  setting?: string;
  style?: string;
};

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <ParticleBackground />
      <Appbar />
      {children}
      <Footer />
    </>
  );
};
