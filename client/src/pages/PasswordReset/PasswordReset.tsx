import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Components
import { Helmet } from "react-helmet";

// Icons
import { AiOutlineLock } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";

// CSS
import mainStyles from "../Main/Main.module.css";
import authFormStyles from "../../components/SideBar/AuthForm.module.css";
import styles from "./PasswordReset.module.css";
//50cd1be47a31508971fdab816e2ad43a
export const PasswordReset = () => {
  const params = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [validResetToken, setValidResetToken] = useState<boolean | undefined>(
    undefined
  );
  const [resetTokenId, setResetTokenId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [passwordInputValue, setPasswordInputValue] = useState<string>("");
  const [validPasswordInput, setValidPasswordInput] = useState<
    boolean | undefined
  >(undefined);
  const [secPasswordInputValue, setSecPasswordInputValue] =
    useState<string>("");
  const [secValidPasswordInput, setSecValidPasswordInput] = useState<
    boolean | undefined
  >(undefined);
  const [formStatus, setFormStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getResetTokenData = async () => {
      const res = await fetch(`${apiUrl}/resetTokens/get`);
      const body: any = await res.json();

      for (let i = 0; i < body["resetTokens"].length; i++) {
        if (body["resetTokens"][i]["urlId"] === params.urlId) {
          setValidResetToken(true);
          setResetTokenId(String(body["resetTokens"][i]["_id"]));
          setEmail(body["resetTokens"][i]["email"]);
          setUserId(body["resetTokens"][i]["user"]);
          break;
        } else if (i === body["resetTokens"].length - 1) {
          setValidResetToken(false);
        }
      }

      if (body["resetTokens"].length === 0) {
        setValidResetToken(false);
      }
    };

    getResetTokenData();
  }, [apiUrl, params]);

  const handleResetPassword = async (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    setFormStatus("loading");
    var proceed = true;

    if (passwordInputValue.length < 8) {
      setValidPasswordInput(false);
      setSecPasswordInputValue("");
      proceed = false;
      setFormStatus(undefined);
    } else if (passwordInputValue !== secPasswordInputValue) {
      setSecValidPasswordInput(false);
      proceed = false;
      setFormStatus(undefined);
    }

    if (proceed === true) {
      var userData = {
        email: email,
        password: secPasswordInputValue,
      };

      await fetch(`${apiUrl}/users/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then(
          async () =>
            await fetch(`${apiUrl}/resetTokens/delete/${resetTokenId}`, {
              method: "DELETE",
              headers: {
                "Content-type": "application/json",
              },
            })
        )
        .then(() => setFormStatus("finished"));
    }
  };

  return formStatus === "finished" ? (
    <div className={`${mainStyles.container} ${styles.container}`}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Reset Successful</title>
      </Helmet>
      <span className={styles.subHeader} style={{ marginTop: "100px" }}>
        Password was successfuly resetted for {email}, now you can head over to
        the{" "}
        <a className={styles.link} onClick={(event) => navigate("/app/login")}>
          login page
        </a>{" "}
        and sign in.
      </span>
    </div>
  ) : validResetToken === true ? (
    <div className={`${mainStyles.container} ${styles.container}`}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Password Reset</title>
      </Helmet>
      <span className={styles.header}>Reset account password</span>
      <span className={styles.subHeader}>Enter a new password for {email}</span>
      <div className={`${styles.inputContainer} ${styles.inputContainer}`}>
        <div className={styles.inputHeader}>
          <AiOutlineLock size={"1.4rem"} style={{ paddingRight: "7px" }} />
          Password
        </div>
        <input
          className={`${styles.input} ${styles.input} ${
            validPasswordInput === false ? styles.invalidInput : null
          }`}
          value={passwordInputValue}
          type={"password"}
          onChange={(event) => (
            setValidPasswordInput(undefined),
            setPasswordInputValue(event.target.value)
          )}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              if (formStatus !== "loading") {
                handleResetPassword(event);
              }
            }
          }}
        />
        <span
          className={`${styles.invalidMessage} ${styles.invalidMessage} ${
            validPasswordInput === false ? styles.visibleErrorMessage : null
          }`}
        >
          Password must have at least 8 characters
        </span>
      </div>
      <div className={`${styles.inputContainer} ${styles.inputContainer}`}>
        <div className={styles.inputHeader} style={{ marginTop: "5px" }}>
          <AiOutlineLock size={"1.4rem"} style={{ paddingRight: "7px" }} />
          Confirm Password
        </div>
        <input
          className={`${styles.input} ${styles.input} ${
            secValidPasswordInput === false ? styles.invalidInput : null
          }`}
          value={secPasswordInputValue}
          type={"password"}
          onChange={(event) => (
            setSecValidPasswordInput(undefined),
            setSecPasswordInputValue(event.target.value)
          )}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              if (formStatus !== "loading") {
                handleResetPassword(event);
              }
            }
          }}
        />
        <span
          className={`${styles.invalidMessage} ${styles.invalidMessage} ${
            secValidPasswordInput === false ? styles.visibleErrorMessage : null
          }`}
        >
          Passwords are not matching
        </span>
      </div>
      <button
        className={`${styles.button} ${styles.button}`}
        onClick={(event) =>
          formStatus !== "loading" ? handleResetPassword(event) : null
        }
      >
        {formStatus === "loading" ? (
          <ImSpinner2 className={authFormStyles.spinner} size={"1.8rem"} />
        ) : (
          <div className={styles.buttonContent}>Reset password</div>
        )}
      </button>
      <div
        className={mainStyles.logoContainer}
        onClick={() => navigate("/app")}
      >
        <img
          className={mainStyles.logo}
          src={require("../../assets/images/link.png")}
          alt={"logo"}
        />
      </div>
    </div>
  ) : validResetToken === false ? (
    <div className={`${mainStyles.container} ${styles.container}`}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Reset failed</title>
      </Helmet>
      <span className={styles.header}>
        This Reset Token is not associated with any account
      </span>
      <div
        className={mainStyles.logoContainer}
        onClick={() => navigate("/app")}
      >
        <img
          className={mainStyles.logo}
          src={require("../../assets/images/link.png")}
          alt={"logo"}
        />
      </div>
    </div>
  ) : (
    <div className={`${mainStyles.container} ${styles.container}`}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Loading...</title>
      </Helmet>
      <span className={styles.header}>Processing...</span>
    </div>
  );
};
