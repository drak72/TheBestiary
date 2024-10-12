import { Link } from "@tanstack/react-router";
import CilCaretRight from "../icons/CilCaretRight";

interface NextProps {
  nextIdx: number | undefined;
  max: number;
}
export const NextArrow = ({ nextIdx, max }: NextProps) => (
  <>
    {typeof nextIdx === "number" && nextIdx < max ? (
      <Link href={`/entity/${nextIdx}`} preload="viewport">
        <CilCaretRight className="arrow-btn" />
      </Link>
    ) : (
      <span className="arrow-btn">_</span>
    )}
  </>
);
