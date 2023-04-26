import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Types
import { Url } from "../../types/url";

// Icons
import { BsBoxArrowInUpRight } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

// Components
import { UrlComponent } from "./UrlComponent";
import { Share } from "../Shortener/Share";

// CSS
import styles from "./Urls.module.css";
import authFormStyles from "./AuthForm.module.css";

type UrlProps = {
  userData: {} | undefined;
  loggedIn: boolean;
  option?: string;
  mobileView: boolean;
};

type UrlsStatus = "loading" | "fetched" | undefined;

export const Urls = (props: UrlProps) => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY!;
  const state = useLocation();
  const [urlsStatus, setUrlsStatus] = useState<UrlsStatus>("loading");
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

  useEffect(() => {
    const fetchUrls = async () => {
      const res = await fetch(
        `${apiUrl}/urls/get/${
          props.userData!["user" as keyof typeof props.userData]
        }`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: apiKey,
          },
        }
      );
      const body: any = await res.json();
      setUrls(body["urls"]);
      setUrlsStatus("fetched");
    };

    const fetchServerSideTime = async () => {
      const res = await fetch(`${apiUrl}/time`);
      const body: any = await res.json();

      setDate(body["message"].split("T")[0]);
      setTime(body["message"].split("T")[1].split(".")[0].slice(0, -3));
    };

    if (props.userData !== undefined) {
      fetchServerSideTime();
      fetchUrls();
    } else {
      setUrlsStatus("fetched");
    }
  }, [props.userData]);

  useEffect(() => {
    if (state["state"] !== null) {
      if (state["state"]["url"] !== null) {
        setSelectedUrl(state["state"]["url"]);
      }
    }
  }, [state]);

  const getTimeLapsed = (
    date: string | undefined,
    time: string | undefined,
    urlCreatedAt: string | undefined
  ) => {
    var timeLapsed: string | number = "";
    var urlCreationDate = urlCreatedAt!.split("T")[0];
    var urlCreationTime = urlCreatedAt!
      .split("T")[1]
      .split(".")[0]
      .slice(0, -3);

    const d1 = new Date(urlCreationDate + " " + urlCreationTime).getTime();
    const d2 = new Date(date + " " + time).getTime();
    timeLapsed = Math.round((d2 - d1) / 60000);

    if (timeLapsed < 60) {
      timeLapsed === 1
        ? (timeLapsed = "a minute ago")
        : timeLapsed > 1
        ? (timeLapsed = timeLapsed + " minutes ago")
        : (timeLapsed = "a few seconds ago");
    } else if (timeLapsed >= 60 && timeLapsed < 1440) {
      timeLapsed = String(timeLapsed / 60).split(".")[0];
      timeLapsed === "1"
        ? (timeLapsed = "an hour ago")
        : (timeLapsed = timeLapsed + " hours ago");
    } else if (timeLapsed >= 1440) {
      timeLapsed = String(timeLapsed / 60 / 24).split(".")[0];
      timeLapsed === "1"
        ? (timeLapsed = "a day ago")
        : (timeLapsed = timeLapsed + " days ago");
    }

    return timeLapsed;
  };

  const handleGoToClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    shortUrl: string
  ) => {
    window.open(`${shortUrl}`, "_blank");
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

  return urlsStatus === "loading" ? (
    <div className={styles.spinnerContainer}>
      <ImSpinner2 className={authFormStyles.spinner} size={"3rem"} />
    </div>
  ) : selectedUrl === undefined ? (
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
        <div className={styles.urlContainer} key={url._id}>
          {index === 0 ? <div className={styles.topSeparator} /> : null}
          {props.mobileView === false ? (
            <div className={styles.linkImgContainer}>
              <img
                className={styles.linkImg}
                src={require("../../assets/images/link.png")}
                alt={"link"}
              />
            </div>
          ) : null}
          <div className={styles.contentContainer}>
            <span className={styles.shortUrl}>{url.shortUrl}</span>
            <div className={styles.bottomContent}>
              <div className={styles.bottomLeftContent}>
                <span className={styles.url}>{url.sourceUrl}</span>
                <span className={styles.time}>
                  {getTimeLapsed(date, time, url.createdAt)}
                </span>
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
                  className={
                    props.loggedIn === true
                      ? `${styles.button}`
                      : `${styles.disabledButton}`
                  }
                  onClick={(event) => handleEditClick(event, url)}
                >
                  Edit
                </button>
                <button
                  className={
                    props.loggedIn === true
                      ? `${styles.button}`
                      : `${styles.disabledButton}`
                  }
                  onClick={(event) => handleStatsClick(event, url)}
                >
                  Stats
                </button>
                <button
                  className={styles.button}
                  style={
                    activeCopyButtonIndex === index
                      ? {
                          backgroundColor: "#2db82d",
                          borderColor: "#2db82d",
                        }
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
      mobileView={props.mobileView}
      handleEditClick={(event, url) => handleEditClick(event, url)}
      handleStatsClick={(event, url) => handleStatsClick(event, url)}
    />
  );
};
