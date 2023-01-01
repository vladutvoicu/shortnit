import styles from "./Features.module.css";
import { BsCheck } from "react-icons/bs";

type featuresProps = {
  handleButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  sideBarVisible: boolean | undefined;
};

export const Features = (props: featuresProps) => {
  return (
    <div className={styles.featuresContainer}>
      <span style={{ marginTop: "40px" }}>Create an account to enjoy:</span>
      <div className={styles.feature} style={{ marginTop: "10px" }}>
        <BsCheck size={"1.6rem"} /> Easy Link Shortening
      </div>
      <div className={styles.feature}>
        <BsCheck size={"1.6rem"} /> Full Link History
      </div>
      <div className={styles.feature}>
        <BsCheck size={"1.6rem"} /> Customized 'Shortnd' Links
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={`${
            props.sideBarVisible === true
              ? styles.disabledButton
              : styles.button
          }`}
          disabled={props.sideBarVisible === true ? true : false}
          onClick={(event) => props.handleButtonClick(event)}
        >
          Create Free Account
        </button>
      </div>
    </div>
  );
};
