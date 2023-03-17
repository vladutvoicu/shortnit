import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { isBrowser, isMobile } from "react-device-detect";

// Components
import { Helmet } from "react-helmet";

// CSS
import mainStyles from "../Main/Main.module.css";
import styles from "./Redirect.module.css";

export const Redirect = () => {
  const params = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [sourceUrl, setSourceUrl] = useState<string | undefined>("");

  useEffect(() => {
    const getIpData = async () => {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return data;
    };

    const updateUrlRedirectData = (ipData: any) => {
      if (sourceUrl === "" || sourceUrl === undefined) {
        var date = new Date().toISOString();
        var user = {
          ip: ipData.ip,
          countryName: ipData.country_name,
          continentCode: ipData.continent_code,
          totalClicks: 0,
          entries: [date],
        };

        (async () => {
          const res = await fetch(`${apiUrl}/urls/get`);
          const body: any = await res.json();

          for (let i = 0; i < body["urls"].length; i++) {
            if (body["urls"][i]["alias"] === params["urlId"]) {
              setSourceUrl(body["urls"][i]["sourceUrl"]);
              var urlData = body["urls"][i];
              var urlUsers: any = urlData["redirectData"]["users"];
              let userFound: boolean = false;

              for (let i = 0; i < urlUsers.length; i++) {
                if (urlUsers[i]["ip"] === user["ip"]) {
                  user["totalClicks"] = Number(urlUsers[i]["totalClicks"]) + 1;
                  user["entries"] = [...urlUsers[i]["entries"], date];
                  urlUsers[i] = user;
                  userFound = true;
                }
              }

              if (userFound === false) {
                user["totalClicks"] = 1;
                urlData["redirectData"]["uniqueClicks"] += 1;
                urlUsers.push(user);

                if (isBrowser === true) {
                  urlData["redirectData"]["desktopUsers"] += 1;
                } else if (isMobile === true) {
                  urlData["redirectData"]["mobileUsers"] += 1;
                }
              }

              urlData["redirectData"]["users"] = urlUsers;

              let urlId = urlData["_id"];
              delete urlData["_id"];
              delete urlData["__v"];
              delete urlData["createdAt"];
              delete urlData["updatedAt"];

              await fetch(`${apiUrl}/urls/update/${urlId}`, {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify(urlData),
              });
              break;
            } else {
              setSourceUrl(undefined);
            }
          }
        })();
      }
    };

    const redirect = () => {
      getIpData()
        .then((ipData) => updateUrlRedirectData(ipData))
        .then(() =>
          sourceUrl !== undefined && sourceUrl !== ""
            ? window.location.replace(sourceUrl)
            : null
        );
    };

    redirect();
  }, [sourceUrl]);

  return (
    <div className={mainStyles.container}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {sourceUrl === ""
            ? "Loading..."
            : sourceUrl !== undefined
            ? `Redirecting...`
            : "Redirection failed"}
        </title>
      </Helmet>
      <div className={styles.textContainer}>
        {sourceUrl === "" ? (
          "Processing, please wait..."
        ) : sourceUrl !== undefined ? (
          <div className={styles.redirectingText}>
            <span>You are being redirected...</span>
            <span
              style={{
                marginTop: "50px",
                paddingBottom: "5px",
                textAlign: "center",
              }}
            >
              If you aren't redirected shortly please click the following link:
            </span>
            <a className={styles.link} href={sourceUrl}>
              {sourceUrl}
            </a>
          </div>
        ) : (
          "Redirection failed because this short url doesn't exist"
        )}
      </div>
    </div>
  );
};
