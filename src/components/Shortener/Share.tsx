import { useEffect, useRef } from "react";

// Functions
import { saveAs } from "file-saver";

// Icons
import { BsTriangleFill, BsMegaphoneFill } from "react-icons/bs";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";

// CSS
import styles from "./Shortener.module.css";

type shareProps = {
  setShareMode: (boolean: boolean) => void;
  finalUrl: string;
  aliasInputValue: string;
  QRUrl: string;
  insideSideBar?: boolean;
};

export const Share = (props: shareProps) => {
  const shareContainerRef = useRef(null);
  useOutsideAlerter(shareContainerRef);

  // if click detected outside 'Share' component then change its state
  function useOutsideAlerter(ref: React.MutableRefObject<any>) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target)) {
          props.setShareMode(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const downloadQRCode = (
    event: React.MouseEvent<HTMLButtonElement>,
    url: string,
    type: string
  ) => {
    saveAs(url, `${props.aliasInputValue}.${type}`);
  };

  return (
    <div
      className={`${
        props.insideSideBar === true
          ? styles.sideBarShareContainer
          : styles.shareContainer
      }`}
      ref={shareContainerRef}
    >
      <div className={styles.shareContainerHeader}>
        <BsMegaphoneFill size={"1.2rem"} /> Share shortened URL
      </div>
      <div className={styles.shareContent}>
        <div className={styles.shareButtonsContainer}>
          <FacebookShareButton
            className={styles.shareButton}
            url={props.finalUrl}
          >
            <FacebookIcon size={35} borderRadius={10} />
            <span className={styles.shareButtonText}>Facebook</span>
          </FacebookShareButton>
          <TwitterShareButton
            className={styles.shareButton}
            url={props.finalUrl}
          >
            <TwitterIcon size={35} borderRadius={10} />
            <span className={styles.shareButtonText}>Twitter</span>
          </TwitterShareButton>
          <WhatsappShareButton
            className={styles.shareButton}
            url={props.finalUrl}
          >
            <WhatsappIcon size={35} borderRadius={10} />
            <span className={styles.shareButtonText}>WhatsApp</span>
          </WhatsappShareButton>
          <EmailShareButton className={styles.shareButton} url={props.finalUrl}>
            <EmailIcon size={35} borderRadius={10} />
            <span className={styles.shareButtonText}>Email</span>
          </EmailShareButton>
        </div>
        <div className={styles.qrCodeContainer}>
          <img className={styles.qrCode} src={props.QRUrl} />
          <div className={styles.qrButtonsContainer}>
            <button
              className={styles.qrButton}
              onClick={(event) => downloadQRCode(event, props.QRUrl, "jpg")}
            >
              JPG
            </button>
            <button
              className={styles.qrButton}
              onClick={(event) => downloadQRCode(event, props.QRUrl, "png")}
            >
              PNG
            </button>
          </div>
        </div>
      </div>
      <BsTriangleFill
        className={`${
          props.insideSideBar === true
            ? styles.sideBarTriangle
            : styles.triangle
        }`}
      />
    </div>
  );
};
