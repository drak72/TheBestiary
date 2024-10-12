import { createFileRoute } from "@tanstack/react-router";
import { EntityCard } from "@components/EntityCard/EntityCard";
import { PreviousArrow } from "@components/buttons/PreviousArrow";
import { NextArrow } from "@components/buttons/NextArrow";
import { cfurl } from "@utils/cfurl";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async ({ context: { items } }) => {
    if (items.length < 1) return;

    const item = (items as string[])[items.length - 1];
    const descriptionFile = await fetch(cfurl({ item, type: "desc.json" }));
    const img = cfurl({ item, type: "img.png" });

    const desc = await descriptionFile.json();
    return { img, desc, len: items.length - 1, item };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    data && (
      <div
        style={{ marginTop: "10vh", marginBottom: "10vh" }}
        className="flex flex-row"
      >
        <PreviousArrow prevIdx={data.len - 1} />
        <EntityCard
          img={data?.img}
          desc={data?.desc}
          item={data.item}
          maxIdx={data.len}
          entityId={data.len.toString()}
        />
        <NextArrow nextIdx={data.len + 1} max={data.len} />
      </div>
    )
  );
}
