import LucideShare2 from "@components/icons/LucideShare2";
import CibFacebookF from "@components/icons/CibFacebookF";
import CibRedditAlt from "@components/icons/CibRedditAlt";
import "@components/buttons/css/CardButtons.css";
import { CopyUrlButton } from "./CopyButton";

interface ShareButton {
  urlToShare: string;
}

/** Sub Components */
const DropDownBtn = () => (
  <button className="dropbtn card-btn">
    <LucideShare2 />
  </button>
);

const FBShare = ({ urlToShare }: ShareButton) => (
  <a
    href={`https://www.facebook.com/sharer.php?u='${urlToShare}'`}
    target="_blank"
  >
    <CibFacebookF />
  </a>
);

const RedditShare = ({ urlToShare }: ShareButton) => (
  <a href={`https://reddit.com/submit?url=${urlToShare}`} target="_blank">
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
