import { Link } from "@tanstack/react-router";
import CilCaretLeft from "../icons/CilCaretLeft";

import "@components/buttons/css/NavigationButtons.css";

interface ArrowProps {
  prevIdx: number | undefined;
}

export const PreviousArrow = ({ prevIdx }: ArrowProps) => (
  <>
    {typeof prevIdx === "number" && prevIdx >= 0 ? (
      <Link to={'/entity/$id'} params={{ id: prevIdx.toString() }} preload="viewport">
        <CilCaretLeft className="arrow-btn" />
      </Link>
    ) : (
      <span className="arrow-btn">_</span>
    )}
  </>
);
