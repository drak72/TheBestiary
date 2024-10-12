interface CFProps {
  item: string;
  type: "img.png" | "desc.json" | "manifest.json";
}

export const cfurl = ({ item, type }: CFProps) => {
  const url =
    import.meta.env.MODE === "development" ? import.meta.env.VITE_CF_URL : "/";

  if (type === "manifest.json") return `${url}manifest.json`;
  return `${url}${item}/${type}`;
};
