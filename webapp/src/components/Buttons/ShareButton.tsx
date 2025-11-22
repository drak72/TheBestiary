import React from "react";
import LucideShare2 from "@components/Icons/LucideShare2";
import CibFacebookF from "@components/Icons/CibFacebookF";
import CibRedditAlt from "@components/Icons/CibRedditAlt";
import { CopyUrlButton } from "./CopyButton";

import "@components/Buttons/css/CardButtons.css";

interface ShareButton {
  urlToShare: string;
}

/** Sub Components */
const DropDownBtn = () => (
  <button className="dropbtn card-btn" data-testid="share-dropdown-btn">
    <LucideShare2 />
  </button>
);

const FBShare = ({ urlToShare }: ShareButton) => (
  <a
    href={`https://www.facebook.com/sharer.php?u='${urlToShare}'`}
    target="_blank"
    data-testid="facebook-share"
  >
    <CibFacebookF />
  </a>
);

const RedditShare = ({ urlToShare }: ShareButton) => (
  <a 
    href={`https://reddit.com/submit?url=${urlToShare}`} 
    target="_blank"
    data-testid="reddit-share"
  >
    <CibRedditAlt />
  </a>
);

/** Main Component */
export const ShareButton = ({ urlToShare }: ShareButton) => (
  <div className="dropdown">
    <DropDownBtn />

    <div className="dropdown-content">
      <FBShare urlToShare={urlToShare} />
      <RedditShare urlToShare={urlToShare} />
      <CopyUrlButton urlToShare={urlToShare} />
    </div>
  </div>
);
