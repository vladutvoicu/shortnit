import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// CSS
import styles from "./Account.module.css";
import authFormStyles from "./AuthForm.module.css";

type AccountProps = {
  userData: {} | undefined;
};

export const Account = (props: AccountProps) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{}>({});

  const handleLogOut = (event: React.MouseEvent<HTMLDivElement>) => {
    localStorage.removeItem("user");

    navigate("/app");
    window.location.reload();
  };

  useEffect(() => {
    setUserData(props.userData!);
  }, [props.userData]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          Account of{" "}
          <span style={{ color: "#00e1ff" }}>
            {userData["email" as keyof typeof userData]}
          </span>
        </span>
      </div>
      <div
        className={styles.buttonContainer}
        onClick={(event) => handleLogOut(event)}
      >
        <button className={`${authFormStyles.button} ${styles.button}`}>
          Log Out
        </button>
      </div>
    </div>
  );
};
