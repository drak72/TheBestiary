import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/favorites/")({
  loader: ({ context: { items } }) => {
    if (items.length < 1) return;
    return items;
  },
});
