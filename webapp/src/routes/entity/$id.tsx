import { createFileRoute } from "@tanstack/react-router";
import { EntityCard } from "@components/EntityCard/EntityCard";
import { PreviousArrow } from "@components/buttons/PreviousArrow";
import { NextArrow } from "@components/buttons/NextArrow";
import { useEntityNavigation } from "@hooks/useEntityNavigation";
import { cfurl } from "@utils/cfurl";

import "@routes/entity/entity.css";

export const Route = createFileRoute("/entity/$id")({
  component: RouteComponent,
  loader: async ({ params: { id }, context: { items } }) => {
    if (items.length < 1) return;

    const item = (items as string[])[+id];
    const img = cfurl({ item, type: "img.png" });
    
    const descDefault = {
      name: "",
      scientific_name: "",
      diet: "",
      habitat: "",
      size: "",
      coloration: "",
      lifespan: "",
      fun_fact: "",
      special_abilities: "",
      model: "",
      date: "",
      prompt: "",
    };

   
    const descriptionFile = await fetch(cfurl({ item, type: "desc.json" }));

    try { 
      const desc = await descriptionFile.json();
      return { img, desc, len: items.length, item };
    } catch (error) {
      return { img, desc: descDefault, len: items.length, item };
    }
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const { id } = Route.useParams();
  const currentId = +id;
  const { swipeRef, prevIdx, nextIdx } = useEntityNavigation({
    currentId,
    maxIdx: data?.len ?? 0,
  });

  return (
    data && (
      <div className="wrapper" ref={swipeRef}>
        <PreviousArrow prevIdx={prevIdx} />
          <EntityCard
            img={data?.img}
            desc={data?.desc}
            item={data.item}
            maxIdx={data.len}
            entityId={id}
          />
        <NextArrow nextIdx={nextIdx} max={data.len} />
      </div>
    )
  );
}
