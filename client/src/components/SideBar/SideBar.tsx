import React, { useRef, useEffect } from "react";

// Components
import { About } from "./About";
import { AuthForm } from "./AuthForm";
import { Urls } from "./Urls";
import { Account } from "./Account";
import { MobileMenu } from "./MobileMenu";

// CSS
import styles from "./SideBar.module.css";

type SideBarProps = {
  visible: boolean;
  contentType: string | undefined;
  mobileSideBar: boolean;
  closeMobileMenu: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  loggedIn: boolean;
  userData: {} | undefined;
  handleXClick: (event?: React.MouseEvent<HTMLDivElement>) => void;
  headerNavBarContainerRef: React.MutableRefObject<any>;
};

export const SideBar = (props: SideBarProps) => {
  const renderContent = (content: string | undefined) => {
    if (props.mobileSideBar === true) {
      return (
        <MobileMenu
          loggedIn={props.loggedIn}
          closeMobileMenu={(event) => props.closeMobileMenu(event)}
        />
      );
    } else {
      switch (content) {
        case "login":
          return props.loggedIn === false ? (
            <AuthForm key={"login"} authType={"login"} resetInput={true} />
          ) : (
            <div className={styles.loggedInText}>
              You are already logged in!
            </div>
          );
        case "register":
          return props.loggedIn === false ? (
            <AuthForm
              key={"register"}
              authType={"register"}
              resetInput={true}
            />
          ) : (
            <div className={styles.loggedInText}>
              You are already logged in!
            </div>
          );
        case "reset":
          return props.loggedIn === false ? (
            <AuthForm key={"reset"} authType={"reset"} resetInput={true} />
          ) : (
            <div className={styles.loggedInText}>
              You are already logged in!
            </div>
          );
        case "about":
          return <About key={"about"} mobileView={false} />;
        case "urls":
          return (
            <Urls
              key={"urls"}
              userData={props.userData}
              loggedIn={props.loggedIn}
              mobileView={false}
            />
          );
        case "edit":
          return (
            <Urls
              key={"urls/edit"}
              userData={props.userData}
              loggedIn={props.loggedIn}
              option={"edit"}
              mobileView={false}
            />
          );
        case "stats":
          return (
            <Urls
              key={"urls/stats"}
              userData={props.userData}
              loggedIn={props.loggedIn}
              option={"stats"}
              mobileView={false}
            />
          );
        case "account":
          return <Account userData={props.userData} />;
        default:
          return null;
      }
    }
  };

  const sideBarRef = useRef(null);
  useOutsideAlerter(sideBarRef, props.headerNavBarContainerRef);

  // if click detected outside 'SideBar' or "headerNavBarContainerRef"
  // components then change SideBar state
  function useOutsideAlerter(
    ref: React.MutableRefObject<any>,
    headerNavBarContainerRef: React.MutableRefObject<any>
  ) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          headerNavBarContainerRef.current &&
          !headerNavBarContainerRef.current.contains(event.target)
        ) {
          props.handleXClick();
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <div
      className={`${
        props.visible === true
          ? styles.visibleContainer
          : styles.invisibleContainer
      }`}
      ref={sideBarRef}
    >
      <div className={styles.header}>
        <div
          className={styles.xContainer}
          onClick={(event) => props.handleXClick(event)}
        >
          <span className={styles.x}>X</span>
        </div>
      </div>
      <div className={styles.content}>{renderContent(props.contentType)}</div>
    </div>
  );
};
