import React from "react";
import { Link } from "@tanstack/react-router";
import CilCaretRight from "@components/Icons/CilCaretRight";

import "@components/Buttons/css/NavigationButtons.css";
interface NextProps {
  nextIdx: number | undefined;
  max: number;
}
export const NextArrow = ({ nextIdx, max }: NextProps) => (
  <>
    {typeof nextIdx === "number" && nextIdx < max ? (
        <Link to={`/entity/$id`} params={{ id: nextIdx.toString() }} preload="viewport">
          <CilCaretRight className="arrow-btn"/>
        </Link>
    ) : (
      <span className="arrow-btn">_</span>
    )}
  </>
);
