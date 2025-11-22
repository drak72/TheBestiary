import React from "react";
import { HeartOutline } from "@components/Icons/HeartOutline";
import { HeartSolid } from "@components/Icons/HeartSolid";
import { useLocalStorage } from "@hooks/useLocalStorage";

import "@components/Buttons/css/CardButtons.css";

interface FavoriteButton {
  entityId: string;
}

export const FavoriteButton = ({ entityId }: FavoriteButton) => {
  const [data, setData] = useLocalStorage<string[]>({
    key: "favorites",
    initialValue: [],
  });

  return (
    <div className="card-btn">
      {data && data?.includes(entityId) ? (
        <button data-testid="HeartSolid"
          onClick={() =>
            setData(data.filter((item: string) => item !== entityId))
          }
        >
          <HeartSolid />
        </button>
      ) : (
        <button  data-testid="HeartOutline" onClick={() => setData([...data, entityId])}>
          <HeartOutline />
        </button>
      )}
    </div>
  );
};
