import { HeartOutline } from "@icons/HeartOutline";
import { HeartSolid } from "@icons/HeartSolid";
import { useLocalStorage } from "@hooks/useLocalStorage";
import "@components/buttons/css/CardButtons.css";

interface FavoriteButton {
  entityId: string;
}

export const FavoriteButton = ({ entityId }: FavoriteButton) => {
  const [data, setData] = useLocalStorage<string[]>({
    key: "favorites",
    default: [],
  });

  return (
    <div className="card-btn">
      {data && data?.includes(entityId) ? (
        <button
          onClick={() =>
            setData(data.filter((item: string) => item !== entityId))
          }
        >
          <HeartSolid />
        </button>
      ) : (
        <button onClick={() => setData([...data, entityId])}>
          <HeartOutline />
        </button>
      )}
    </div>
  );
};
