import { useState } from "react";
import { Features } from "../../components/Features/Features";
import { SideBar } from "../../components/SideBar/SideBar";
import { Helmet } from "react-helmet";
import styles from "./Main.module.css";

export const Main = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [sideBarVisible, setSideBarVisible] = useState<boolean | undefined>(
    undefined
  );
  const [sideBarContentType, setSideBarContentType] = useState<
    string | undefined
  >(undefined);

  return (
    <div className={styles.container}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>ShortnIt</title>
      </Helmet>
      <div className={styles.header}>
        <div className={styles.headerTitleContainer}>
          <span className={styles.headerTitle}>ShortnIt</span>
        </div>
        <div className={styles.headerNavBarContainer}>
          <div className={styles.headerNavBar}>
            <span
              className={`${styles.navBarItem} ${
                sideBarContentType === "urls" ? styles.selectedNavBarItem : null
              }`}
              onClick={(event) => (
                setSideBarVisible(true), setSideBarContentType("urls")
              )}
            >
              My URLs
            </span>
            <span
              className={`${styles.navBarItem} ${
                sideBarContentType === "about"
                  ? styles.selectedNavBarItem
                  : null
              }`}
              onClick={(event) => (
                setSideBarVisible(true), setSideBarContentType("about")
              )}
            >
              How It Works
            </span>
            <span
              className={`${styles.navBarItem} ${
                sideBarContentType === "signUp"
                  ? styles.selectedNavBarItem
                  : null
              }`}
              onClick={(event) => (
                setSideBarVisible(true), setSideBarContentType("signUp")
              )}
            >
              Sign Up
            </span>
            <span
              className={`${styles.navBarItem} ${
                sideBarContentType === "signIn"
                  ? styles.selectedNavBarItem
                  : null
              }`}
              onClick={(event) => (
                setSideBarVisible(true), setSideBarContentType("signIn")
              )}
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
          handleXClick={(event) => (
            setSideBarVisible(false), setSideBarContentType(undefined)
          )}
        />
      ) : null}
      <div className={styles.sectionsContainer}>
        <div className={styles.leftSection}></div>
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
              handleButtonClick={(event) => (
                setSideBarVisible(true), setSideBarContentType("signUp")
              )}
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
