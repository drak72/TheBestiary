import { useState } from "react";


const CopyIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

interface CopyUrlButton {
  urlToShare: string;
}

export const CopyUrlButton = ({ urlToShare }: CopyUrlButton) => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(urlToShare);
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (err) {
      console.error(`ShareButton: Failed to copy URL: ${urlToShare}`, err);
    }
  };

  return (
    <div>
      <button onClick={handleCopy}>
        <CopyIcon />
      </button>

      {showSnackbar && <div className="snackbar">URL copied to clipboard!</div>}
    </div>
  );
};
