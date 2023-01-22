import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Types
import { Url } from "../../types/url";

// Icons
import { BsBoxArrowInUpRight } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";

// Components
import { UrlComponent } from "./UrlComponent";
import { Share } from "../Shortener/Share";

// CSS
import styles from "./Urls.module.css";

type UrlProps = {
  loggedIn: boolean;
  option?: string;
};

export const Urls = (props: UrlProps) => {
  const navigate = useNavigate();
  const state = useLocation();
  const [urls, setUrls] = useState<Url[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<Url | undefined>(undefined);
  const [activeCopyButtonIndex, setActiveCopyButtonIndex] = useState<
    number | undefined
  >(undefined);
  const [shareMode, setShareMode] = useState<boolean>(false);
  const [shareModeIndex, setShareModeIndex] = useState<number | undefined>(
    undefined
  );
  const [QRUrl, setQRUrl] = useState<string>("");
  const [date, setDate] = useState<string | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [notLoggedInError, setNotLoggedInError] = useState<boolean>(false);

  // useEffect(() => {
  //   // get server side date & time from api and set consts
  // }, []);

  useEffect(() => {
    if (state["state"] !== null) {
      if (state["state"]["url"] !== null) {
        setSelectedUrl(state["state"]["url"]);
      }
    }
  }, [state]);

  const getTimeLapsed = (
    date: string | undefined,
    time: string | undefined
  ) => {
    // calculate time lapsed from the creation of shortened url
    time = "x hours/days ago";
    return time;
  };

  const handleGoToClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    shortUrl: string
  ) => {
    window.open(`https://${shortUrl}`, "_blank");
  };

  const handleShareClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    shortUrl: string,
    index: number
  ) => {
    setQRUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=${shortUrl}`
    );
    setShareModeIndex(index);
    setShareMode(true);
  };

  const handleCopyClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    shortUrl: string,
    index: number
  ) => {
    navigator.clipboard.writeText(shortUrl);
    setActiveCopyButtonIndex(index);
    setTimeout(function () {
      setActiveCopyButtonIndex(undefined);
    }, 1000);
  };

  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    url: Url
  ) => {
    if (props.loggedIn === false) {
      setNotLoggedInError(true);
      setTimeout(function () {
        setNotLoggedInError(false);
      }, 10000);
    } else if (props.loggedIn === true) {
      navigate(`/app/urls/edit/${url.alias}`, { state: { url: url } });
    }
  };

  const handleStatsClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    url: Url
  ) => {
    if (props.loggedIn === false) {
      if (notLoggedInError === false) {
        setNotLoggedInError(true);
        setTimeout(function () {
          setNotLoggedInError(false);
        }, 10000);
      }
    } else if (props.loggedIn === true) {
      setSelectedUrl(url);
      navigate(`/app/urls/stats/${url.alias}`, { state: { url: url } });
    }
  };

  return selectedUrl === undefined ? (
    <div className={styles.container}>
      {notLoggedInError === true ? (
        <div className={styles.notLoggedInError}>
          You need an account to be able to edit urls and view stats!
        </div>
      ) : null}
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          {urls.length === 0
            ? "You don't have any shortened URLs"
            : "Your recent shortened URLs"}
        </span>
        {props.loggedIn === false ? (
          <button
            className={styles.headerButton}
            onClick={(event) => navigate("/app/register")}
          >
            Get Full Detailed Stats
          </button>
        ) : null}
      </div>
      {urls.map((url, index) => (
        <div className={styles.urlContainer}>
          {index === 0 ? <div className={styles.topSeparator} /> : null}
          <div className={styles.linkImgContainer}>
            <img
              className={styles.linkImg}
              src={require("../../assets/images/link.png")}
              alt={"link"}
            />
          </div>
          <div className={styles.contentContainer}>
            <span className={styles.shortUrl}>{url.shortUrl}</span>
            <div className={styles.bottomContent}>
              <div className={styles.bottomLeftContent}>
                <span className={styles.url}>{url.url}</span>
                <span className={styles.time}>{getTimeLapsed(date, time)}</span>
              </div>
              <div className={styles.bottomRightContent}>
                <button
                  className={styles.button}
                  onClick={(event) => handleGoToClick(event, url.shortUrl)}
                >
                  <BsBoxArrowInUpRight size={"1.2rem"} />
                </button>
                <button
                  className={`${
                    shareMode && shareModeIndex === index
                      ? styles.shareButtonActive
                      : styles.button
                  }`}
                  onClick={(event) =>
                    handleShareClick(event, url.shortUrl, index)
                  }
                >
                  Share
                  {shareMode && shareModeIndex === index ? (
                    <Share
                      setShareMode={(boolean) => setShareMode(boolean)}
                      finalUrl={url.shortUrl}
                      aliasInputValue={url.alias}
                      QRUrl={QRUrl}
                      insideSideBar={true}
                    />
                  ) : null}
                </button>
                <button
                  className={styles.button}
                  onClick={(event) => handleEditClick(event, url)}
                >
                  Edit
                </button>
                <button
                  className={styles.button}
                  onClick={(event) => handleStatsClick(event, url)}
                >
                  Stats
                </button>
                <button
                  className={styles.button}
                  style={
                    activeCopyButtonIndex === index
                      ? { backgroundColor: "#2db82d", borderColor: "#2db82d" }
                      : {}
                  }
                  onClick={(event) =>
                    handleCopyClick(event, url.shortUrl, index)
                  }
                >
                  {activeCopyButtonIndex !== index ? (
                    <FaRegCopy size={"1rem"} />
                  ) : null}
                  {activeCopyButtonIndex === index ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
          <div className={styles.separator} />
        </div>
      ))}
    </div>
  ) : (
    <UrlComponent
      url={selectedUrl}
      option={props.option}
      handleEditClick={(event, url) => handleEditClick(event, url)}
      handleStatsClick={(event, url) => handleStatsClick(event, url)}
    />
  );
};
