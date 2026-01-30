import CilSync from "@icons/CilSync";
import "@components/buttons/css/CardButtons.css";

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
