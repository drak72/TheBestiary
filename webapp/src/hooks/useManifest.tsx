import { cfurl } from "@utils/cfurl";
import { useEffect, useState } from "react";

export const useManifest = () => {
  const [manifest, setManifest] = useState<string[]>([]);
  useEffect(() => {
    const fetchManifest = async () => {
      const res = await fetch(
        cfurl({ item: "manifest", type: "manifest.json" }),
      );
      const data = await res.json();
      setManifest(data);
    };

    fetchManifest();
  }, []);

  return manifest;
};
