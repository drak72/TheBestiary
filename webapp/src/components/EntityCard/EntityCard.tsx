import { FavoriteButton } from "@components/buttons/FavoriteButton";
import { RandomButton } from "@components/buttons/RandomButton";
import { ShareButton } from "@components/buttons/ShareButton";
import { CardFooter } from "@components/EntityCard/CardFooter"; 
import { Divider } from "@components/Divider";
import type { Description } from "types";

import "@components/EntityCard/css/EntityCard.css";
import "@components/EntityCard/css/Image.css";

interface CardProps {
  img: string;
  desc: Description;
  item: string;
  entityId: string;
  maxIdx: number;
}

export const EntityCard = ({
  img,
  desc,
  item,
  maxIdx,
  entityId,
}: CardProps) => {
  const href = window.location.toString();

  const {
    name,
    scientific_name,
    habitat,
    diet,
    size,
    coloration,
    lifespan,
    special_abilities,
    fun_fact,
    date,
    prompt,
  } = desc;

  return (
    <div className={`entity-card`}>
      <img className="entity-image" src={img} alt={name || "Entity image"} />

      <div className="card-content">
        <h5>{name}</h5>

        <div className="card-content-header">
          <p className="scientific-name">{scientific_name}</p>

          <div className="card-btns">
            <ShareButton urlToShare={href} />
            <RandomButton max={maxIdx} />
            <FavoriteButton entityId={entityId} />
          </div>
        </div>

        <Divider />
        <div className="details-grid">
          {[
            { head: "Habitat", txt: habitat },
            { head: "Coloration", txt: coloration },
            { head: "Size", txt: size },
            { head: "Diet", txt: diet },
            { head: "Lifespan", txt: lifespan },
            { head: "Abilities", txt: special_abilities },
            { head: "Fun Fact", txt: fun_fact },
          ].map(({ head, txt }) => (
            <div key={head}>
              <b className="details-label">{head}</b>
              <p className="details-text">{txt}</p>
            </div>
          ))}
        </div>

        <Divider />
        <CardFooter item={item} date={date} prompt={prompt} />
      </div>
    </div>
  );
};
