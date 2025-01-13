import { Link } from "@tanstack/react-router";
import CilCaretLeft from "../icons/CilCaretLeft";

import "@components/buttons/css/NavigationButtons.css";

interface ArrowProps {
  prevIdx: number | undefined;
}

export const PreviousArrow = ({ prevIdx }: ArrowProps) => (
  <>
    {typeof prevIdx === "number" && prevIdx >= 0 ? (
      <Link href={`/entity/${prevIdx}`} preload="viewport">
        <CilCaretLeft className="arrow-btn" />
      </Link>
    ) : (
      <span className="arrow-btn">_</span>
    )}
  </>
);
