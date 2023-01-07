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
};

export const Shortener = (props: shortenerProps) => {
  const [shortenerStatus, setShortenerStatus] = useState<string | undefined>(
    undefined
  );
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
    var condition2 =
      alias.length < 4 ? false : alias.length < 31 ? true : false;

    if (pattern.test(alias) === false || condition2 === false) {
      valid = false;
    }
    return valid;
  };

  const handleAliasInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAliasInputValue(event.target.value);

    if (event.target.value !== "") {
      setValidAliasInput(isValidAlias(event.target.value));
    } else {
      setValidAliasInput(undefined);
    }
  };

  const handleShortener = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShortenerStatus("loading");
    var url = urlInputValue;
    var alias = aliasInputValue;
    var proceed = true;

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
      setShortenerStatus("");
      proceed = false;
    }
    if (alias === "") {
      setValidAliasInput(false);
      setShortenerStatus("");
      proceed = false;
    }
    if (validUrlInput === false || validAliasInput === false) {
      setShortenerStatus("");
      proceed = false;
    }

    if (proceed === true) {
      var finalUrl = `https://shortnit.web.app/${alias}`;
      setFinalUrl(finalUrl);
      setQRUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=${finalUrl}`
      );
      setShortenerStatus("finished");
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
          : styles.container
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
          value={urlInputValue}
          disabled={shortenerStatus === "finished" ? true : false}
          onChange={(event) => handleUrlInput(event)}
        />
        {validUrlInput === false ? (
          <span className={styles.invalidMessage}>Invalid URL</span>
        ) : null}
        {validUrlInput === false ? (
          <div className={styles.errorCircleContainer}>
            <BiErrorCircle className={styles.errorCircle} />
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
            placeholder={"alias"}
            value={aliasInputValue}
            onChange={(event) => handleAliasInput(event)}
          />
          {validAliasInput === false ? (
            <span className={styles.invalidMessage}>Invalid alias</span>
          ) : null}
          {validAliasInput === false ? (
            <div className={styles.errorCircleContainer}>
              <BiErrorCircle className={styles.errorCircle} />
            </div>
          ) : null}
        </div>
      ) : (
        <div className={styles.inputContainer}>
          <input
            className={styles.disabledInput}
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
                  ? { backgroundColor: "#2db82d", borderColor: "#2db82d" }
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
