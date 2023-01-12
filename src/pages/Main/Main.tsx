import { useState, useEffect } from "react";

// Functions
import { useNavigate, useLocation } from "react-router-dom";

// Components
import { Features } from "../../components/Features/Features";
import { SideBar } from "../../components/SideBar/SideBar";
import { Helmet } from "react-helmet";
import { Shortener } from "../../components/Shortener/Shortener";

// CSS
import styles from "./Main.module.css";

type mainProps = {
  sideBarContentType?: string | undefined;
  blankPath?: boolean;
};

export const Main = (props: mainProps) => {
  const navigate = useNavigate();
  const state = useLocation();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [sideBarVisible, setSideBarVisible] = useState<boolean | undefined>(
    undefined
  );
  const [sideBarContentType, setSideBarContentType] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (props.blankPath === true) {
      navigate("/app");
    }

    if (props.sideBarContentType !== undefined) {
      setSideBarContentType(props.sideBarContentType);
      setSideBarVisible(true);
    } else {
      // side bar animation will be canceled if "/" or "/app" path is refreshed
      if (state["state"] !== null) {
        state["state"]["xClicked"]
          ? setSideBarVisible(false)
          : setSideBarVisible(undefined);
        window.history.replaceState({}, document.title);
      }
      setSideBarContentType(undefined);
    }
  }, [props, navigate, state]);

  return (
    <div className={styles.container}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {sideBarContentType !== undefined
            ? sideBarContentType.charAt(0).toUpperCase() +
              sideBarContentType.slice(1)
            : "ShortnIt"}
        </title>
      </Helmet>
      <div className={styles.header}>
        <div className={styles.headerTitleContainer}>
          <span
            className={styles.headerTitle}
            onClick={(event) => (
              navigate("/app", { state: { xClicked: false } }),
              window.location.reload()
            )}
          >
            ShortnIt
          </span>
        </div>
        <div className={styles.headerNavBarContainer}>
          <div className={styles.headerNavBar}>
            <span
              className={`${
                sideBarContentType === "urls"
                  ? styles.selectedNavBarItem
                  : styles.navBarItem
              }`}
              onClick={(event) =>
                sideBarContentType === "urls" ? null : navigate("/app/urls")
              }
            >
              My URLs
            </span>
            <span
              className={`${
                sideBarContentType === "about"
                  ? styles.selectedNavBarItem
                  : styles.navBarItem
              }`}
              onClick={(event) =>
                sideBarContentType === "about" ? null : navigate("/app/about")
              }
            >
              How It Works
            </span>
            <span
              className={`${
                sideBarContentType === "register"
                  ? styles.selectedNavBarItem
                  : styles.navBarItem
              }`}
              onClick={(event) =>
                sideBarContentType === "register"
                  ? null
                  : navigate("/app/register")
              }
            >
              Sign Up
            </span>
            <span
              className={`${
                sideBarContentType === "login"
                  ? styles.selectedNavBarItem
                  : styles.navBarItem
              }`}
              onClick={(event) =>
                sideBarContentType === "login" ? null : navigate("/app/login")
              }
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
      {sideBarVisible !== undefined ? (
        <SideBar
          visible={sideBarVisible}
          contentType={sideBarContentType}
          handleXClick={(event) =>
            navigate("/app", { state: { xClicked: true } })
          }
        />
      ) : null}
      <div className={styles.sectionsContainer}>
        <div className={styles.leftSection}>
          <Shortener handleMyURLsClick={(event) => navigate("/app/urls")} />
        </div>
        <div className={styles.rightSection}>
          <span>Tired of your long, ugly share link?</span>
          <span>
            Use{" "}
            <span style={{ fontFamily: "Francois One", fontSize: "1.6rem" }}>
              ShortnIt
            </span>
            , make it nice!
          </span>
          {!loggedIn ? (
            <Features
              sideBarVisible={sideBarVisible}
              handleButtonClick={(event) => navigate("/app/register")}
            />
          ) : null}
        </div>
      </div>
      <div className={styles.logoContainer}>
        <img
          className={styles.logo}
          src={require("../../assets/images/link.png")}
          alt={"logo"}
        />
      </div>
    </div>
  );
};
