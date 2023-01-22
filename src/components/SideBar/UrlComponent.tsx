import { useState } from "react";

// Icons
import { BiErrorCircle } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";

// Components
import { Url } from "../../types/url";

// CSS
import styles from "./Urls.module.css";
import inputStyles from "./AuthForm.module.css";

type UrlProps = {
  url: Url;
  option: string | undefined;
  handleEditClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    url: Url
  ) => void;
  handleStatsClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    url: Url
  ) => void;
};

export const UrlComponent = (props: UrlProps) => {
  const [changeStatus, setChangeStatus] = useState<string | undefined>(
    undefined
  );
  const [aliasInputValue, setAliasInputValue] = useState<string>(
    props.url.alias
  );
  const [validAliasInput, setValidAliasInput] = useState<boolean | undefined>(
    undefined
  );
  const [urlInputValue, setUrlInputValue] = useState<string>(props.url.url);
  const [validUrlInput, setValidUrlInput] = useState<boolean | undefined>(
    undefined
  );

  const isValidAlias = (alias: string) => {
    // will move the below to api instead
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

  const isValidUrl = (url: string) => {
    // will move the below to api istead
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

  const handleApplyChanges = (event: React.MouseEvent<HTMLButtonElement>) => {
    setChangeStatus("loading");
    var url: string = urlInputValue;
    var alias: string = aliasInputValue;
    var proceed: boolean = true;

    // will move the below to api instead
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
      setChangeStatus(undefined);
      proceed = false;
    }
    if (alias === "") {
      setValidAliasInput(false);
      setChangeStatus(undefined);
      proceed = false;
    }
    if (validUrlInput === false || validAliasInput === false) {
      setChangeStatus(undefined);
      proceed = false;
    }

    if (proceed === true) {
      var finalUrl = `https://shortnit.web.app/${alias}`;

      setChangeStatus("finished");
    } else {
      setChangeStatus(undefined);
    }
  };

  return (
    <div className={inputStyles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle} style={{ textAlign: "center" }}>
          {props.option === "edit"
            ? "Editing URL"
            : props.option === "stats"
            ? "Stats"
            : null}
        </span>
        <button
          className={styles.headerButton}
          style={{ width: "200px" }}
          onClick={(event) =>
            props.option === "edit"
              ? props.handleStatsClick(event, props.url)
              : props.option === "stats"
              ? props.handleEditClick(event, props.url)
              : null
          }
        >
          {props.option === "edit"
            ? "View stats"
            : props.option === "stats"
            ? "Edit URL"
            : null}
        </button>
      </div>
      {props.option === "edit" ? (
        <div
          className={styles.contentContainer}
          style={{ alignItems: "center" }}
        >
          <span
            className={inputStyles.inputHeader}
            style={{ justifyContent: "center", fontSize: "1.3rem" }}
          >
            Alias
          </span>
          <div className={inputStyles.inputContainer} style={{ width: "60%" }}>
            <input
              className={`${inputStyles.input} ${
                validAliasInput === false ? inputStyles.invalidInput : null
              }`}
              value={aliasInputValue}
              onChange={(event) => (
                setValidAliasInput(undefined), handleAliasInput(event)
              )}
            />
            {validAliasInput === false ? (
              <div className={inputStyles.errorCircleContainer}>
                <BiErrorCircle
                  className={inputStyles.errorCircle}
                  size={"1.3rem"}
                />
              </div>
            ) : null}
          </div>
          <span
            className={`${inputStyles.invalidMessage} ${
              validAliasInput === false ? inputStyles.visibleErrorMessage : null
            }`}
            style={{ justifyContent: "center" }}
          >
            Invalid alias
          </span>
          <span
            className={inputStyles.inputHeader}
            style={{ justifyContent: "center", fontSize: "1.3rem" }}
          >
            URL
          </span>
          <div className={inputStyles.inputContainer} style={{ width: "60%" }}>
            <input
              className={`${inputStyles.input} ${
                validUrlInput === false ? inputStyles.invalidInput : null
              }`}
              value={urlInputValue}
              onChange={(event) => (
                setValidUrlInput(undefined), handleUrlInput(event)
              )}
            />
            {validUrlInput === false ? (
              <div className={inputStyles.errorCircleContainer}>
                <BiErrorCircle
                  className={inputStyles.errorCircle}
                  size={"1.3rem"}
                />
              </div>
            ) : null}
          </div>
          <span
            className={`${inputStyles.invalidMessage} ${
              validUrlInput === false ? inputStyles.visibleErrorMessage : null
            }`}
            style={{ justifyContent: "center" }}
          >
            Invalid URL
          </span>
          <button
            className={inputStyles.button}
            onClick={(event) => handleApplyChanges(event)}
          >
            {changeStatus === "loading" ? (
              <ImSpinner2 className={inputStyles.spinner} size={"1.8rem"} />
            ) : (
              "Apply Changes"
            )}
          </button>
        </div>
      ) : props.option === "stats" ? (
        // will complete while integrating api
        <div
          className={styles.contentContainer}
          style={{ height: "auto" }}
        ></div>
      ) : null}
    </div>
  );
};
