// Icons
import { VscWand } from "react-icons/vsc";
import { HiOutlineQrcode } from "react-icons/hi";

// CSS
import styles from "./About.module.css";

export const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.textContainer}>
          <span className={styles.header}>Create your 'Shortnd' links.</span>
          <span className={styles.text}>
            Slim down your long links with my URL shortener. Get more clicks and
            more exposure with customized links that reflect you. Manage your
            shortened links from the ShortnIt dashboard. Use short URLs for your
            social media, email campaigns, or wherever you need them. The links
            are reliable, safe, and never expire.
          </span>
        </div>
        <div className={styles.iconContainer}>
          <img
            className={styles.icon}
            src={require("../../assets/images/link.png")}
            alt={"icon"}
          />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.iconContainer}>
          <VscWand className={styles.icon} />
        </div>
        <div className={styles.textContainer}>
          <span className={styles.header}>What is a link shortener?</span>
          <span className={styles.text}>
            A link shortener is a tool that transforms your long links into
            shorter ones. My tool can drastically shorten your long links and
            still reliably direct to the same web pages. To use my link
            shortener, the user only has to copy and paste their long link into
            the tool and it is condensed into a more shareable link.
          </span>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.textContainer}>
          <span className={styles.header}>See how links work for you.</span>
          <span className={styles.text}>
            See who clicks on your shortened URLs, from where, and on what
            devices. Pair your links with QR codes or customized reports. I
            track your clicks with the primary purpose of empowering you with
            the knowledge you need to make your shortened URLs work harder and
            faster for your needs.
          </span>
        </div>
        <div className={styles.iconContainer}>
          <HiOutlineQrcode className={styles.QRCode} />
        </div>
      </div>
    </div>
  );
};
