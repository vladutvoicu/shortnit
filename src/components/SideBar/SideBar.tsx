import styles from "./SideBar.module.css";

type SideBarProps = {
  visible: boolean;
  contentType: string | undefined;
  handleXClick: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export const SideBar = (props: SideBarProps) => {
  return (
    <div
      className={`${
        props.visible ? styles.visibleContainer : styles.invisibleContainer
      }`}
    >
      <div className={styles.header}>
        <div
          className={styles.xContainer}
          onClick={(event) => props.handleXClick(event)}
        >
          <span className={styles.x}>X</span>
        </div>
      </div>
      <div className={styles.content}>{props.contentType}</div>
    </div>
  );
};
