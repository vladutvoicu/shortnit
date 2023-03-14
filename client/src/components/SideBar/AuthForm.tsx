import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { AiOutlineMail, AiFillMail, AiOutlineLock } from "react-icons/ai";
import { BiErrorCircle, BiLogIn } from "react-icons/bi";
import { GoCheck } from "react-icons/go";
import { ImSpinner2 } from "react-icons/im";

// CSS
import styles from "./AuthForm.module.css";

type authFormProps = {
  authType: string;
  resetInput: boolean;
};

export const AuthForm = (props: authFormProps) => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [authFormStatus, setAuthFormStatus] = useState<string | undefined>(
    undefined
  );
  const [emailInputValue, setEmailInputValue] = useState<string>("");
  const [validEmailInput, setValidEmailInput] = useState<boolean | undefined>(
    undefined
  );
  const [passwordInputValue, setPasswordInputValue] = useState<string>("");
  const [validPasswordInput, setValidPasswordInput] = useState<
    boolean | undefined
  >(undefined);
  const [checkedBox, setCheckedBox] = useState<boolean>(false);
  const [tooManyRequests, setTooManyRequests] = useState<boolean>(false);

  useEffect(() => {
    if (props.resetInput === true) {
      setAuthFormStatus(undefined);
      setEmailInputValue("");
      setValidEmailInput(undefined);
      setPasswordInputValue("");
      setValidPasswordInput(undefined);
      setCheckedBox(false);
    }
  }, [props]);

  const isValidEmail = (email: string) => {
    var pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
  };

  const isValidPassword = (password: string) => {
    var result = true;
    if (password.length < 8) {
      result = false;
    }
    return result;
  };

  const handleCreateAccount = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAuthFormStatus("loading");
    var proceed = true;

    if (emailInputValue !== "") {
      setValidEmailInput(isValidEmail(emailInputValue));
    } else {
      setValidEmailInput(false);
      proceed = false;
    }

    if (passwordInputValue !== "") {
      setValidPasswordInput(isValidPassword(passwordInputValue));
    } else {
      setValidPasswordInput(false);
      proceed = false;
    }

    if (proceed === true) {
      let userData = {
        email: emailInputValue,
        password: passwordInputValue,
        tempUser: false,
      };

      var body: any;
      let tempUserData: any = JSON.parse(localStorage.getItem("user")!);
      if (tempUserData !== null) {
        if (tempUserData["tempUser"] === true) {
          const res = await fetch(
            `${apiUrl}/users/update/${tempUserData["user"]}`,
            {
              method: "PATCH",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ ...userData }),
            }
          );
          body = await res.json();
        }
      } else {
        const res = await fetch(`${apiUrl}/users/create/`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        body = await res.json();
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userData,
          user: body["user"]["_id"],
          rememberLogin: true,
        })
      );

      navigate("/app");
      window.location.reload();
    } else {
      setAuthFormStatus(undefined);
    }
  };

  const handleLogIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setAuthFormStatus("loading");
    var proceed = true;

    if (isValidEmail(emailInputValue) === false) {
      setValidEmailInput(false);
      proceed = false;
    }

    if (isValidPassword(passwordInputValue) === false) {
      setValidPasswordInput(false);
      proceed = false;
    }

    if (proceed === true) {
      let userData = {
        email: emailInputValue,
        password: passwordInputValue,
      };

      const res = await fetch(`${apiUrl}/users/get/`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const userBody: any = await res.json();

      for (let i = 0; i < userBody["users"].length; i++) {
        if (userBody["users"][i]["email"] === emailInputValue) {
          if (userBody["users"][i]["password"] === passwordInputValue) {
            let tempUserData: any = JSON.parse(localStorage.getItem("user")!);
            if (tempUserData !== null) {
              const res = await fetch(
                `${apiUrl}/urls/get/${tempUserData["user"]}`,
                {
                  method: "GET",
                  headers: {
                    "Content-type": "application/json",
                  },
                }
              );
              const urlsBody: any = await res.json();

              for (let j = 0; j < urlsBody["urls"].length; j++) {
                let urlData = urlsBody["urls"][j];
                urlData["user"] = userBody["users"][i]["_id"];
                let urlId = urlData["_id"];
                delete urlData["_id"];
                delete urlData["__v"];
                delete urlData["createdAt"];
                delete urlData["updatedAt"];

                await fetch(`${apiUrl}/urls/update/${urlId}`, {
                  method: "PATCH",
                  headers: {
                    "Content-type": "application/json",
                  },
                  body: JSON.stringify(urlData),
                });
              }

              await fetch(`${apiUrl}/users/delete/${tempUserData["user"]}`, {
                method: "DELETE",
                headers: {
                  "Content-type": "application/json",
                },
              });
            }

            localStorage.setItem(
              "user",
              JSON.stringify({
                ...userData,
                user: userBody["users"][i]["_id"],
                rememberLogin: checkedBox,
              })
            );

            setAuthFormStatus("finished");

            navigate("/app");
            window.location.reload();
          } else {
            setValidPasswordInput(false);
            setPasswordInputValue("");
            setAuthFormStatus(undefined);
          }
          break;
        } else if (i === userBody["users"].length - 1) {
          setValidEmailInput(false);
          setPasswordInputValue("");
          setAuthFormStatus(undefined);
        }
      }
    } else {
      setAuthFormStatus(undefined);
    }
  };

  const handleResetPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAuthFormStatus("loading");
    var proceed = true;

    if (isValidEmail(emailInputValue) === false) {
      setValidEmailInput(false);
      proceed = false;
    }

    if (proceed === true) {
      (async () => {
        await fetch(`${apiUrl}/resetTokens/create/`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email: emailInputValue }),
        }).then((res) => {
          if (!res.ok) {
            res.json().then((error) => {
              if (error.message === "Email not found") {
                setAuthFormStatus(undefined);
                setValidEmailInput(false);
              } else {
                setTooManyRequests(true);
                setAuthFormStatus("finished");
              }
            });
          } else {
            setAuthFormStatus("finished");
          }
        });
      })().catch((error) => console.log(error));
    } else {
      setAuthFormStatus(undefined);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>ShortnIt</span>
        <span className={styles.headerSubTitle}>
          {props.authType !== "reset"
            ? "Welcome to ShortnIt"
            : "Reset password"}
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.inputHeader}>
          <AiOutlineMail size={"1.4rem"} style={{ paddingRight: "7px" }} />
          E-Mail Address
        </div>
        <div className={styles.inputContainer}>
          <input
            className={`${styles.input} ${
              validEmailInput === false ? styles.invalidInput : null
            }`}
            value={emailInputValue}
            type={"email"}
            onChange={(event) => (
              setValidEmailInput(undefined),
              setEmailInputValue(event.target.value)
            )}
          />
          {validEmailInput === false ? (
            <div className={styles.errorCircleContainer}>
              <BiErrorCircle className={styles.errorCircle} size={"1.3rem"} />
            </div>
          ) : null}
        </div>
        <span
          className={`${styles.invalidMessage} ${
            validEmailInput === false ? styles.visibleErrorMessage : null
          }`}
        >
          Invalid email
        </span>
        {props.authType === "reset" ? null : (
          <div className={styles.inputHeader}>
            <AiOutlineLock size={"1.4rem"} style={{ paddingRight: "7px" }} />
            Password
          </div>
        )}
        {props.authType === "reset" ? null : (
          <div className={styles.inputContainer}>
            <input
              className={`${styles.input} ${
                validPasswordInput === false ? styles.invalidInput : null
              }`}
              value={passwordInputValue}
              type={"password"}
              onChange={(event) => (
                setValidPasswordInput(undefined),
                setPasswordInputValue(event.target.value)
              )}
            />
            {validPasswordInput === false ? (
              <div className={styles.errorCircleContainer}>
                <BiErrorCircle className={styles.errorCircle} size={"1.3rem"} />
              </div>
            ) : null}
          </div>
        )}
        {props.authType === "reset" && authFormStatus === "finished" ? (
          <span className={styles.resetInfoText}>
            {tooManyRequests === true
              ? "Too many reset requests, please wait 12 hours and try again."
              : "You will be sent a password reset link shortly, it may take a few minutes to recieve the email."}
          </span>
        ) : null}
        {props.authType === "register" ||
        (validPasswordInput === false && props.authType !== "reset") ? (
          <span
            className={`${styles.invalidMessage} ${
              validPasswordInput === false ? styles.visibleErrorMessage : null
            }`}
          >
            Invalid password
          </span>
        ) : null}
        {props.authType === "login" ? (
          <div className={styles.optionsContainer}>
            <div
              className={styles.checkboxContainer}
              onClick={(event) =>
                checkedBox === false
                  ? setCheckedBox(true)
                  : setCheckedBox(false)
              }
            >
              <div
                className={`${
                  checkedBox === false
                    ? styles.checkbox
                    : styles.checkedCheckbox
                }`}
              >
                <GoCheck
                  size={"1.1rem"}
                  style={checkedBox ? {} : { opacity: 0 }}
                />
              </div>
              <span className={styles.option} style={{ marginLeft: "5px" }}>
                Remember me
              </span>
            </div>
            <span
              className={styles.option}
              onClick={(event) => navigate("/app/password/reset")}
            >
              Forgot password?
            </span>
          </div>
        ) : null}
        <button
          className={styles.button}
          onClick={(event) =>
            authFormStatus !== "loading"
              ? props.authType === "login"
                ? handleLogIn(event)
                : props.authType === "register"
                ? handleCreateAccount(event)
                : props.authType === "reset"
                ? handleResetPassword(event)
                : null
              : null
          }
        >
          {authFormStatus === "loading" ? (
            <ImSpinner2 className={styles.spinner} size={"1.8rem"} />
          ) : (
            <div className={styles.buttonContent}>
              {props.authType === "reset" ? (
                <AiFillMail size={"1.4rem"} style={{ marginRight: "10px" }} />
              ) : (
                <BiLogIn size={"1.4rem"} style={{ marginRight: "10px" }} />
              )}
              {props.authType === "register"
                ? "Create An Account"
                : props.authType === "login"
                ? "Sign In"
                : props.authType === "reset"
                ? "Send Password Reset Link"
                : null}
            </div>
          )}
        </button>
        {props.authType === "register" ? (
          <div className={styles.formText}>
            Already a user?
            <span
              className={styles.textLink}
              onClick={(event) => navigate("/app/login")}
            >
              Log In
            </span>
          </div>
        ) : (
          <div className={styles.formText}>
            Don't have an account?
            <span
              className={styles.textLink}
              onClick={(event) => navigate("/app/register")}
            >
              Sign Up
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
