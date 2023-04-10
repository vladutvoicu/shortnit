import { useNavigate } from "react-router-dom";

// CSS
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  loggedIn: boolean;
  closeMobileMenu: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
};

export const MobileMenu = (props: MobileMenuProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.menuOptionsContainer}>
        <span
          className={styles.menuOption}
          onClick={(event) => (navigate("/"), props.closeMobileMenu(event))}
        >
          Shortener
        </span>
        <span
          className={styles.menuOption}
          onClick={(event) => (
            navigate("/app/urls"), props.closeMobileMenu(event)
          )}
        >
          My URLs
        </span>
        <span
          className={styles.menuOption}
          onClick={(event) => (
            navigate("/app/about"), props.closeMobileMenu(event)
          )}
        >
          How It Works
        </span>
        {props.loggedIn === false ? (
          <span
            className={styles.menuOption}
            onClick={(event) => (
              navigate("/app/register"), props.closeMobileMenu(event)
            )}
          >
            Sign Up
          </span>
        ) : null}
        {props.loggedIn === false ? (
          <span
            className={styles.menuOption}
            onClick={(event) => (
              navigate("/app/login"), props.closeMobileMenu(event)
            )}
          >
            Sign In
          </span>
        ) : null}
        {props.loggedIn === true ? (
          <span
            className={styles.menuOption}
            onClick={(event) => (
              navigate("/app/account"), props.closeMobileMenu(event)
            )}
          >
            Account
          </span>
        ) : null}
      </div>
    </div>
  );
};
