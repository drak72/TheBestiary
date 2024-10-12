import { useLocalStorage } from "@hooks/useLocalStorage";
import { cfurl } from "@utils/cfurl";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import "@routes/favorites/favorites.css";

export const Route = createLazyFileRoute("/favorites/")({
  component: RouteComponent,
});

function RouteComponent() {
  const items = Route.useLoaderData();
  const [favorites] = useLocalStorage<string[]>({
    key: "favorites",
    default: [],
  });

  return (
    <div className="favorites-grid">
      {items &&
        favorites.map((id) => (
          <div key={`url-${id}`}>
            <Link href={`/entity/${+id}`}>
              <img
                className="favorites-image"
                src={cfurl({ item: items[+id], type: "img.png" })}
              />
            </Link>
          </div>
        ))}
    </div>
  );
}
