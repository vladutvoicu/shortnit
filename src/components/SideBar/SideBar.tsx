import React, { useRef, useEffect } from "react";

// Components
import { About } from "./About";
import { AuthForm } from "./AuthForm";
import { Urls } from "./Urls";

// CSS
import styles from "./SideBar.module.css";

type SideBarProps = {
  visible: boolean;
  contentType: string | undefined;
  loggedIn: boolean;
  handleXClick: (event?: React.MouseEvent<HTMLDivElement>) => void;
  headerNavBarContainerRef: React.MutableRefObject<any>;
};

export const SideBar = (props: SideBarProps) => {
  const renderContent = (content: string | undefined) => {
    switch (content) {
      case "login":
        return <AuthForm key={"login"} authType={"login"} resetInput={true} />;
      case "register":
        return (
          <AuthForm key={"register"} authType={"register"} resetInput={true} />
        );
      case "reset":
        return <AuthForm key={"reset"} authType={"reset"} resetInput={true} />;
      case "about":
        return <About key={"about"} />;
      case "urls":
        return <Urls key={"urls"} loggedIn={props.loggedIn} />;
      case "edit":
        return (
          <Urls key={"urls/edit"} loggedIn={props.loggedIn} option={"edit"} />
        );
      case "stats":
        return (
          <Urls key={"urls/stats"} loggedIn={props.loggedIn} option={"stats"} />
        );
      default:
        return null;
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
