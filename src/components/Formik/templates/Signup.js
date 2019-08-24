import React, { useState } from "react";
import { Formik } from "formik";

import error from "../assets/error.svg";
import success from "../assets/success.svg";
const BUTTON_HEIGHT = 30;

const LoginForm = props => {
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState("");

  const title = props.title || "Sign In.";
  const text =
    props.text ||
    "Sign up and we'll send you the latest news from us. No Spam.";
  const successText =
    props.successText || "Thank you. We will contact you soon.";
  const theme = props.theme;
  let styles;

  if (theme === "apple") {
    styles = require("./AppleTheme.module.css");
  } else {
    styles = require("./Login.module.css");
  }

  return (
    <Formik {...props}>
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          isValid,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset
        } = props;

        const handleSubmitted = e => {
          setSubmitted(true);

          const u = values.email.split("@")[0];
          setUser(u);

          if (props.onSubmit)
            props.onSubmit({ submitted: true, value: values });
          return handleSubmit(e);
        };

        const ShowErrors = ({ errors, touched }) => {
          const e = Object.keys(errors);
          const t = Object.keys(touched);
          const Default = i => (
            <div key={i} className={styles.feedback}>
              {" "}
            </div>
          );
          if (e.length === 0) {
            return <Default />;
          } else {
            return e.map(v => {
              if (errors[v] && touched[v]) {
                return (
                  <div key={errors[v]} className={styles.feedback}>
                    {errors[v]}
                  </div>
                );
              } else {
                return <Default key={v} />;
              }
            });
          }
        };

        const inputDiv = (
          <div className={styles.inputContainer}>
            <div className={styles.inputBar}>
              <input
                id="nickname"
                placeholder="Nickname"
                type="text"
                value={values.nickname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.nickname && touched.nickname
                    ? styles.textInput + " " + styles.error
                    : styles.textInput
                }
              />
              <input
                id="email"
                placeholder="Email Address"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.email && touched.email
                    ? styles.textInput + " " + styles.error
                    : styles.textInput
                }
              />
              <input
                id="password"
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.password && touched.password
                    ? styles.textInput + " " + styles.error
                    : styles.textInput
                }
              />
            </div>

            {/* <button
                type="button"
                className={styles.reset}
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
              >
                <img src={error} height={BUTTON_HEIGHT} alt="x" />
              </button> */}

            <button
              className={styles.submit}
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Submit
            </button>
          </div>
        );

        const thankYouDiv = (
          <div className={styles.inputContainer}>
            <img src={success} height={BUTTON_HEIGHT} alt="v" />
            <h1 className={styles.thank}>{successText}</h1>
          </div>
        );

        return (
          <form className={styles.form} onSubmit={handleSubmitted}>
            <h1
              className={styles.title}
              htmlFor="email"
              style={{ display: "block" }}
            >
              {title}
            </h1>
            <h4 className={styles.subtitle}>{text}</h4>
            {submitted ? thankYouDiv : inputDiv}

            <br />
            <ShowErrors errors={errors} touched={touched} />
          </form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
