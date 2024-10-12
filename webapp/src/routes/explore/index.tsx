import { createFileRoute } from "@tanstack/react-router";
import { MODEL_MAP } from "../../consts";
import { ModelID } from "types";

export const Route = createFileRoute("/explore/")({
  loader: ({ context: { items } }) => {
    if (items.length < 1) return { rowData: [], colDefs: [] };

    const rows = items.map((item, idx) => {
      const [date, imgModel, txtModel, subject, adjectives, setting, style] =
        item.split("-");
      return {
        id: idx,
        date,
        imgModel: MODEL_MAP[imgModel as ModelID],
        txtModel: MODEL_MAP[txtModel as ModelID],
        subject,
        adjectives,
        setting,
        style,
      };
    });

    const cols = Object.keys(rows[0]).map((key) => {
      if (key === "id") return { field: key, width: 50 };
      return { field: key };
    });

    return { rows, cols };
  },
});
