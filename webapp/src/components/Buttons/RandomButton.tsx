import React from "react";
import CilSync from "@components/Icons/CilSync";

import "@components/Buttons/css/CardButtons.css";

interface RandomButton {
  max: number;
}

export const RandomButton = ({ max }: RandomButton) => {
  return (
    <a className="card-btn" href={`/entity/${Math.floor(Math.random() * max)}`}>
      <CilSync />
    </a>
  );
};
