import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { BiErrorCircle } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";

// Components
import { Url } from "../../types/url";

// CSS
import styles from "./UrlComponent.module.css";
import urlStyles from "./Urls.module.css";
import authFormStyles from "./AuthForm.module.css";

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
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [changeStatus, setChangeStatus] = useState<string | undefined>(
    undefined
  );
  const [urlData, setUrlData] = useState<Url | undefined>(undefined);
  const [urlId, setUrlId] = useState<string | undefined>("");
  const [aliasInputValue, setAliasInputValue] = useState<string>(
    props.url.alias
  );
  const [validAliasInput, setValidAliasInput] = useState<boolean | undefined>(
    undefined
  );
  const [urlInputValue, setUrlInputValue] = useState<string>(
    props.url.sourceUrl
  );
  const [validUrlInput, setValidUrlInput] = useState<boolean | undefined>(
    undefined
  );
  const [numberOfLoadedEntries, setNumberOfLoadedEntries] = useState<number>(5);

  useEffect(() => {
    setUrlData(props.url);
    setUrlId(props.url._id);
  }, [props.url]);

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

  const handleApplyChanges = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setChangeStatus("loading");
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
      setChangeStatus(undefined);
      proceed = false;
    }
    if (alias === "") {
      setValidAliasInput(false);
      setChangeStatus(undefined);
      proceed = false;
    }

    // check if alias isn't already in use
    const res = await fetch(`${apiUrl}/urls/get`);
    const urlsData = await res.json();

    for (let i = 0; i < urlsData["urls"].length; i++) {
      if (alias === urlsData["urls"][i]["alias"]) {
        setValidAliasInput(false);
        setChangeStatus(undefined);
        proceed = false;
      }
    }

    if (validUrlInput === false || validAliasInput === false) {
      setChangeStatus(undefined);
      proceed = false;
    }

    if (proceed === true) {
      var finalUrl = `https://shortnit.web.app/${alias}`;
      urlData!["shortUrl"] = finalUrl;
      urlData!["sourceUrl"] = urlInputValue;
      urlData!["alias"] = alias;

      delete urlData!["_id"];
      delete urlData!["__v"];
      delete urlData!["createdAt"];
      delete urlData!["updatedAt"];

      await fetch(`${apiUrl}/urls/update/${urlId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(urlData),
      });

      setChangeStatus("finished");
    } else {
      setChangeStatus(undefined);
    }
  };

  const getUrlTotalClicks = () => {
    var total = 0;

    if (urlData !== undefined) {
      var urlUsers = urlData["redirectData"]["users"];

      for (let i = 0; i < urlUsers.length; i++) {
        total = total + Number(urlUsers[i]["totalClicks"]);
      }
    }

    return formatNumber(total);
  };

  const getUrlUniqueClicks = () => {
    var total = 0;

    if (urlData !== undefined) {
      total = urlData["redirectData"]["uniqueClicks"];
    }

    return formatNumber(total);
  };

  const getUrlDesktopUsers = () => {
    var total = 0;

    if (urlData !== undefined) {
      total = urlData["redirectData"]["desktopUsers"];
    }

    return formatNumber(total);
  };

  const getUrlDesktopUsersPercentage = () => {
    var total = "0%";

    if (urlData !== undefined) {
      let uniqueClicks = getUrlUniqueClicks();
      let desktopUsers = getUrlDesktopUsers();

      total =
        String((Number(desktopUsers) / Number(uniqueClicks)) * 100).split(
          "."
        )[0] + "%";
    }

    return total;
  };

  const getUrlMobileUsers = () => {
    var total = 0;

    if (urlData !== undefined) {
      total = urlData["redirectData"]["mobileUsers"];
    }

    return formatNumber(total);
  };

  const getUrlMobileUsersPercentage = () => {
    var total = "0%";

    if (urlData !== undefined) {
      let uniqueClicks = getUrlUniqueClicks();
      let mobileUsers = getUrlMobileUsers();

      total =
        String((Number(mobileUsers) / Number(uniqueClicks)) * 100).split(
          "."
        )[0] + "%";
    }

    return total;
  };

  const formatNumber = (num: number) => {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.round(Math.abs(num) / 100) / 10) + "k"
      : Math.sign(num) * Math.abs(num);
  };

  const getTopLocations = () => {
    interface TopLocations {
      country: string;
      clicks?: number;
      percentage?: string;
    }

    if (urlData !== undefined) {
      let userData = urlData["redirectData"]["users"];

      const uniqueCountries: { [key: string]: TopLocations } = {};

      userData.forEach((data) => {
        if (!uniqueCountries[data.countryName]) {
          uniqueCountries[data.countryName] = {
            country: data.countryName,
            clicks: data.totalClicks,
          };
        } else {
          uniqueCountries[data.countryName].clicks! += data.totalClicks;
        }
      });

      const totalClicks = userData.reduce(
        (acc, data) => acc + data.totalClicks,
        0
      );

      const topLocations: TopLocations[] = [];
      for (const country in uniqueCountries) {
        const clicks = uniqueCountries[country].clicks;
        const percentage = ((clicks! / totalClicks) * 100).toFixed(0);
        topLocations.push({ country, clicks, percentage: `${percentage}%` });
      }

      return topLocations.sort((a, b) => b.clicks! - a.clicks!);
    } else {
      return [];
    }
  };

  const getUrlEntries = () => {
    var sortedEntries: {}[] = [];
    if (urlData !== undefined) {
      var entries: {}[] = [];
      let userData = urlData["redirectData"]["users"];

      for (let i = 0; i < userData.length; i++) {
        let userEntries = userData[i]["entries"];
        let tempUserEntries: any = [];

        for (let j = 0; j < userEntries.length; j++) {
          tempUserEntries.push({
            date: (userEntries as any)[j]["date"],
            deviceType: (userEntries as any)[j]["deviceType"],
            country: userData[i]["countryName"],
          });
        }
        entries = [...entries, ...tempUserEntries];
      }

      sortedEntries = entries.sort((a: any, b: any) => {
        const dateA: any = new Date(a["date"]);
        const dateB: any = new Date(b["date"]);
        return dateB - dateA;
      });
    }

    return sortedEntries;
  };

  return (
    <div className={`${authFormStyles.container} ${styles.container}`}>
      <div className={urlStyles.header}>
        <span
          className={urlStyles.headerTitle}
          style={{ textAlign: "center", height: "50px", marginTop: "10px" }}
        >
          {props.option === "edit"
            ? "Editing URL"
            : props.option === "stats"
            ? "Stats"
            : null}
        </span>
        <button
          className={urlStyles.headerButton}
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
          className={urlStyles.contentContainer}
          style={{ alignItems: "center" }}
        >
          <span
            className={authFormStyles.inputHeader}
            style={{ justifyContent: "center", fontSize: "1.3rem" }}
          >
            Alias
          </span>
          <div
            className={authFormStyles.inputContainer}
            style={{ width: "60%" }}
          >
            <input
              className={`${authFormStyles.input} ${
                validAliasInput === false ? authFormStyles.invalidInput : null
              }`}
              value={aliasInputValue}
              onChange={(event) => (
                setValidAliasInput(undefined), handleAliasInput(event)
              )}
            />
            {validAliasInput === false ? (
              <div className={authFormStyles.errorCircleContainer}>
                <BiErrorCircle
                  className={authFormStyles.errorCircle}
                  size={"1.3rem"}
                />
              </div>
            ) : null}
          </div>
          <span
            className={`${authFormStyles.invalidMessage} ${
              validAliasInput === false
                ? authFormStyles.visibleErrorMessage
                : null
            }`}
            style={{ justifyContent: "center" }}
          >
            Invalid alias
          </span>
          <span
            className={authFormStyles.inputHeader}
            style={{ justifyContent: "center", fontSize: "1.3rem" }}
          >
            URL
          </span>
          <div
            className={authFormStyles.inputContainer}
            style={{ width: "60%" }}
          >
            <input
              className={`${authFormStyles.input} ${
                validUrlInput === false ? authFormStyles.invalidInput : null
              }`}
              value={urlInputValue}
              onChange={(event) => (
                setValidUrlInput(undefined), handleUrlInput(event)
              )}
            />
            {validUrlInput === false ? (
              <div className={authFormStyles.errorCircleContainer}>
                <BiErrorCircle
                  className={authFormStyles.errorCircle}
                  size={"1.3rem"}
                />
              </div>
            ) : null}
          </div>
          <span
            className={`${authFormStyles.invalidMessage} ${
              validUrlInput === false
                ? authFormStyles.visibleErrorMessage
                : null
            }`}
            style={{ justifyContent: "center" }}
          >
            Invalid URL
          </span>
          <span
            className={styles.finishedMessage}
            style={
              changeStatus === "finished" ? { opacity: 1 } : { opacity: 0 }
            }
          >
            Changes applied successfuly! Go back to{" "}
            <span
              className={styles.link}
              onClick={(event) => navigate("/app/urls")}
            >
              urls
            </span>
          </span>
          <button
            className={authFormStyles.button}
            onClick={(event) => handleApplyChanges(event)}
          >
            {changeStatus === "loading" ? (
              <ImSpinner2 className={authFormStyles.spinner} size={"1.8rem"} />
            ) : (
              "Apply Changes"
            )}
          </button>
        </div>
      ) : props.option === "stats" ? (
        <div className={urlStyles.contentContainer} style={{ height: "auto" }}>
          <div className={styles.clicksContainer}>
            <div className={styles.halfContainerContent}>
              <span>Total Clicks</span>
              <div className={styles.nonHoverNumberContainer}>
                <div className={styles.numberContainerContent}>
                  <div className={styles.numberContainerFront}>
                    {getUrlTotalClicks()}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.halfContainerContent}>
              <span>Unique Clicks</span>
              <div className={styles.nonHoverNumberContainer}>
                <div className={styles.numberContainerContent}>
                  <div className={styles.numberContainerFront}>
                    {getUrlUniqueClicks()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.usersDeviceContainer}>
            <div className={styles.halfContainerContent}>
              <span>Desktop Users</span>
              <div className={styles.numberContainer}>
                <div className={styles.numberContainerContent}>
                  <div className={styles.numberContainerFront}>
                    {getUrlDesktopUsers()}
                  </div>
                  <div className={styles.numberContainerBack}>
                    {getUrlDesktopUsersPercentage()}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.halfContainerContent}>
              <span>Mobile Users</span>
              <div className={styles.numberContainer}>
                <div className={styles.numberContainerContent}>
                  <div className={styles.numberContainerFront}>
                    {getUrlMobileUsers()}
                  </div>
                  <div className={styles.numberContainerBack}>
                    {getUrlMobileUsersPercentage()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.contentMapContainer}>
            <span style={{ fontSize: "1.4rem", fontFamily: "Francois One" }}>
              Top locations of total clicks
            </span>
            <div className={styles.contentMapContent}>
              {getTopLocations().map((location: any) => (
                <div key={location["country"]} className={styles.mapItem}>
                  <span className={styles.mapHeader}>
                    {location["country"]}
                  </span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressBarPercentage}
                      style={{
                        width: `${
                          parseFloat(location["percentage"]) <= 10
                            ? "10%"
                            : location["percentage"]
                        }`,
                      }}
                    >
                      <span style={{ width: "100%", textAlign: "center" }}>
                        {location["percentage"]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className={styles.contentMapContainer}
            style={{ paddingBottom: "50px" }}
          >
            <span style={{ fontSize: "1.4rem", fontFamily: "Francois One" }}>
              Latest entries
            </span>
            <div className={styles.contentMapContent}>
              {getUrlEntries()
                .slice(0, numberOfLoadedEntries)
                .map((entry: any, index) => (
                  <div key={index} className={styles.mapItem}>
                    {index !== 0 ? <div className={styles.separator} /> : null}
                    <span className={styles.mapHeader}>
                      {new Date(entry["date"]).getDate() +
                        " / " +
                        (new Date(entry["date"]).getMonth() + 1) +
                        " / " +
                        new Date(entry["date"]).getFullYear() +
                        " - " +
                        new Date(entry["date"]).getHours() +
                        ":" +
                        `${
                          new Date(entry["date"]).getMinutes() < 10 ? "0" : ""
                        }` +
                        new Date(entry["date"]).getMinutes() +
                        ":" +
                        `${
                          new Date(entry["date"]).getSeconds() < 10 ? "0" : ""
                        }` +
                        new Date(entry["date"]).getSeconds()}
                    </span>
                    <span
                      className={styles.mapHeader}
                      style={{ fontStyle: "normal" }}
                    >
                      {entry["country"] + " - "}
                      {entry["deviceType"].charAt(0).toUpperCase() +
                        entry["deviceType"].slice(1) +
                        " " +
                        "Device"}
                    </span>
                  </div>
                ))}
              {numberOfLoadedEntries < getUrlEntries().length ? (
                <div className={styles.mapButtonContainer}>
                  <button
                    className={authFormStyles.button}
                    onClick={(event) =>
                      setNumberOfLoadedEntries(numberOfLoadedEntries + 5)
                    }
                  >
                    Load More
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
