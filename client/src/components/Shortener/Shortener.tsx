import React, { useState } from "react";

// Icons
import { VscWand } from "react-icons/vsc";
import { BiErrorCircle } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";
import { BsBoxArrowInUpRight, BsShare } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";

// Components
import { Share } from "./Share";

// CSS
import styles from "./Shortener.module.css";

type shortenerProps = {
  handleMyURLsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  loggedIn: boolean;
};

type shortenerStatusType = "loading" | "finished" | "" | undefined;

export const Shortener = (props: shortenerProps) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [shortenerStatus, setShortenerStatus] =
    useState<shortenerStatusType>(undefined);
  const [urlInputValue, setUrlInputValue] = useState<string>("");
  const [validUrlInput, setValidUrlInput] = useState<boolean | undefined>(
    undefined
  );
  const [aliasInputValue, setAliasInputValue] = useState<string>("");
  const [validAliasInput, setValidAliasInput] = useState<boolean | undefined>(
    undefined
  );
  const [finalUrl, setFinalUrl] = useState<string>("");
  const [copyButtonText, setCopyButtonText] = useState<string>("Copy");
  const [shareMode, setShareMode] = useState<boolean>(false);
  const [QRUrl, setQRUrl] = useState<string>("");

  const isValidUrl = (url: string) => {
    var pattern =
      /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return pattern.test(url);
  };

  const handleUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInputValue(event.target.value);

    if (event.target.value !== "") {
      setValidUrlInput(isValidUrl(event.target.value));
    } else {
      setValidUrlInput(undefined);
    }
  };

  const isValidAlias = (alias: string) => {
    var valid = true;
    var pattern = /^[\w- ]*$/;
    var pattern2 = /^[a-z0-9_-]{3,30}$/;

    if (pattern.test(alias) === false || pattern2.test(alias) === false) {
      valid = false;
    }
    return valid;
  };

  const handleAliasInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAliasInputValue(event.target.value.toLowerCase());

    if (event.target.value !== "") {
      setValidAliasInput(isValidAlias(event.target.value.toLowerCase()));
    } else {
      setValidAliasInput(undefined);
    }
  };

  const handleShortener = async (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    setShortenerStatus("loading");
    var url: string = urlInputValue;
    var alias: string = aliasInputValue;
    var proceed: boolean = true;

    alias = alias.replace(/  +/g, " ");
    alias = alias.replace(/ /g, "-");
    alias = alias.replace(/--+/g, "-");
    alias = alias.replace(/__+/g, "_");

    while (
      alias[0] === "-" ||
      alias[0] === "_" ||
      alias[alias.length - 1] === "-" ||
      alias[alias.length - 1] === "_"
    ) {
      if (alias[0] === "-" || alias[0] === "_") {
        alias = alias.slice(1);
      }
      if (alias[alias.length - 1] === "-" || alias[alias.length - 1] === "_") {
        alias = alias.slice(0, alias.length - 1);
      }
      if (alias === "-" || alias === "_") {
        alias = "";
      }
    }
    setAliasInputValue(alias);

    if (url === "") {
      setValidUrlInput(false);
      setShortenerStatus(undefined);
      proceed = false;
    }
    if (alias === "") {
      setValidAliasInput(false);
      setShortenerStatus(undefined);
      proceed = false;
    }

    // check if alias isn't already in use
    const res = await fetch(`${apiUrl}/urls/get`);
    const urlsData = await res.json();

    for (let i = 0; i < urlsData["urls"].length; i++) {
      if (alias === urlsData["urls"][i]["alias"]) {
        setValidAliasInput(false);
        setShortenerStatus(undefined);
        proceed = false;
      }
    }

    if (validUrlInput === false || validAliasInput === false) {
      setShortenerStatus(undefined);
      proceed = false;
    }

    if (proceed === true) {
      var finalUrl = `https://shortnit.web.app/${alias}`;
      setFinalUrl(finalUrl);
      setQRUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=${finalUrl}`
      );
      var user: any = JSON.parse(localStorage.getItem("user")!);

      if (user === null) {
        var body: any;
        const res = await fetch(`${apiUrl}/users/create/`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ tempUser: true }),
        }).then(async (res) => {
          body = await res.json();
          if (!res.ok) {
            res.json().then((error) => {
              console.log(error);
              setShortenerStatus(undefined);
            });
          }
        });

        user = { user: body["user"]["_id"], tempUser: true };
        localStorage.setItem(
          "user",
          JSON.stringify({
            user: body["user"]["_id"],
            tempUser: true,
          })
        );
      }

      var urlData = {
        user: user["user"],
        sourceUrl: urlInputValue,
        alias: alias,
        shortUrl: finalUrl,
        redirectData: {
          users: [],
          uniqueClicks: 0,
          mobileUsers: 0,
          desktopUsers: 0,
        },
      };

      if (props.loggedIn === false) {
        let tempUrls: any = JSON.parse(localStorage.getItem("tempUrls")!);
        if (tempUrls !== null) {
          tempUrls = [...tempUrls, urlData];
        }

        localStorage.setItem(
          "tempUrls",
          JSON.stringify(tempUrls !== null ? tempUrls : [urlData])
        );
      }

      await fetch(`${apiUrl}/urls/create`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(urlData),
      }).then((res) => {
        if (!res.ok) {
          res.json().then((error) => {
            console.log(error);
            setShortenerStatus(undefined);
          });
        } else {
          setShortenerStatus("finished");
        }
      });
    } else {
      setShortenerStatus(undefined);
    }
  };

  const handleShortenAnotherClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setShortenerStatus("");
    setShareMode(false);
    setUrlInputValue("");
    setAliasInputValue("");
  };

  const handleCopyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(finalUrl);
    setCopyButtonText("Copied!");
    setTimeout(function () {
      setCopyButtonText("Copy");
    }, 1000);
  };

  const handleGoToClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    window.open(finalUrl, "_blank");
  };

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareMode(true);
  };

  return (
    <div
      className={`${
        shortenerStatus === undefined
          ? styles.initialContainer
          : shortenerStatus === "finished"
          ? styles.extendedContainer
          : styles.initialContainer
      }`}
    >
      <div className={styles.header}>
        <img
          className={styles.icon}
          src={require("../../assets/images/link.png")}
          alt={"logo"}
        />
        Enter a long URL to make a 'Shortnd' URL
      </div>
      <div className={styles.inputContainer}>
        <input
          className={`${styles.input} ${
            validUrlInput === false ? styles.invalidInput : null
          } ${shortenerStatus === "finished" ? styles.disabledInput : null}`}
          autoCapitalize={"none"}
          value={urlInputValue}
          disabled={shortenerStatus === "finished" ? true : false}
          onChange={(event) => handleUrlInput(event)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              if (shortenerStatus !== "loading") {
                handleShortener(event);
              }
            }
          }}
        />
        {validUrlInput === false ? (
          <span className={styles.invalidMessage}>Invalid URL</span>
        ) : null}
        {validUrlInput === false ? (
          <div className={styles.errorCircleContainer}>
            <BiErrorCircle className={styles.errorCircle} size={"1.3rem"} />
          </div>
        ) : null}
      </div>
      <div className={styles.header}>
        <VscWand
          size={"1.4rem"}
          style={{ paddingRight: "7px", marginLeft: "20px" }}
        />
        Customize your link
      </div>
      {shortenerStatus !== "finished" ? (
        <div className={styles.inputContainer}>
          <span
            className={`${styles.link} ${
              validAliasInput === false ? styles.invalidInput : null
            }`}
          >
            shortnit.web.app
          </span>
          <span className={styles.slash}>/</span>
          <input
            className={`${styles.input} ${
              validAliasInput === false ? styles.invalidInput : null
            }`}
            autoCapitalize={"none"}
            placeholder={"alias"}
            value={aliasInputValue}
            onChange={(event) => handleAliasInput(event)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                if (shortenerStatus !== "loading") {
                  handleShortener(event);
                }
              }
            }}
          />
          {validAliasInput === false ? (
            <span className={styles.invalidMessage}>Invalid alias</span>
          ) : null}
          {validAliasInput === false ? (
            <div className={styles.errorCircleContainer}>
              <BiErrorCircle className={styles.errorCircle} size={"1.3rem"} />
            </div>
          ) : null}
        </div>
      ) : (
        <div className={styles.inputContainer}>
          <input
            className={styles.disabledInput}
            autoCapitalize={"none"}
            value={finalUrl}
            disabled={true}
          />
        </div>
      )}
      {shortenerStatus !== "finished" ? (
        <div className={styles.buttonContainer}>
          {
            <button
              className={styles.mainButton}
              onClick={(event) => handleShortener(event)}
            >
              {shortenerStatus === "loading" ? (
                <ImSpinner2 className={styles.spinner} size={"1.8rem"} />
              ) : (
                "Shorten URL"
              )}
            </button>
          }
        </div>
      ) : (
        <div className={styles.buttonsContainer}>
          <div className={styles.buttonRow}>
            <button
              className={styles.firstRowButton}
              onClick={(event) => handleGoToClick(event)}
            >
              <BsBoxArrowInUpRight size={"1.2rem"} />
            </button>
            <button
              className={`${
                shareMode === true
                  ? styles.shareButtonActive
                  : styles.firstRowButton
              }`}
              onClick={(event) => handleShareClick(event)}
            >
              <BsShare size={"1.1rem"} /> Share
              {shareMode ? (
                <Share
                  setShareMode={(boolean) => setShareMode(boolean)}
                  finalUrl={finalUrl}
                  aliasInputValue={aliasInputValue}
                  QRUrl={QRUrl}
                />
              ) : null}
            </button>
            <button
              className={styles.firstRowButton}
              style={
                copyButtonText === "Copied!"
                  ? {
                      backgroundColor: "#2db82d",
                      borderColor: "#2db82d",
                    }
                  : {}
              }
              onClick={(event) => handleCopyClick(event)}
            >
              {copyButtonText === "Copy" ? (
                <FaRegCopy size={"1.12rem"} />
              ) : null}{" "}
              {copyButtonText}
            </button>
          </div>
          <div className={styles.buttonRow}>
            <button
              className={styles.secondRowButton}
              onClick={(event) => props.handleMyURLsClick(event)}
            >
              My URLs
            </button>
            <button
              className={styles.secondRowButton}
              onClick={(event) => handleShortenAnotherClick(event)}
            >
              Shorten another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
