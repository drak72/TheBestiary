import { useNavigate } from "@tanstack/react-router";
import { useSwipe } from "./useSwipe";

interface UseEntityNavigationParams {
  currentId: number;
  maxIdx: number;
}

export const useEntityNavigation = ({ currentId, maxIdx }: UseEntityNavigationParams) => {
  const navigate = useNavigate();
  const prevIdx = currentId - 1;
  const nextIdx = currentId + 1;

  const swipeRef = useSwipe({
    onSwipeLeft: () => {
      if (nextIdx < maxIdx) {
        navigate({ to: "/entity/$id", params: { id: nextIdx.toString() } });
      }
    },
    onSwipeRight: () => {
      if (prevIdx >= 0) {
        navigate({ to: "/entity/$id", params: { id: prevIdx.toString() } });
      }
    },
  });

  return { swipeRef, prevIdx, nextIdx };
};

