import { cfurl } from "@utils/cfurl";
import { useEffect, useState } from "react";

/** Fetches a cached manifest containing all of the S3 Keypaths for images & fact cards
 * @returns {string[]} - Array of strings containing the S3 Keypaths
 */
export const useManifest = (): string[] => {
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
  }, []); // Run once on component mount. 

  return manifest;
};
