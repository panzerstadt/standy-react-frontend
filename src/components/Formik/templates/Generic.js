import React, { useState } from "react";
import { Formik, Form, Field } from "formik";

import styles from "./Generic.module.css";

import error from "../assets/error.svg";
import success from "../assets/success.svg";

const BUTTON_HEIGHT = 30;

const EmailForm = props => {
  const [submitted, setSubmitted] = useState(false);
  const initialKeys = Object.keys(props.initialValues);

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

          if (props.onSubmit)
            props.onSubmit({ submitted: true, value: values });
          return handleSubmit(e);
        };

        const ShowErrors = ({ errors, touched }) => {
          const e = Object.keys(errors);
          const t = Object.keys(touched);
          if (e.length === 0) {
            return null;
          } else {
            return e.map(v => {
              return (
                errors[v] &&
                touched[v] && (
                  <div key={errors[v]} className="input-feedback">
                    {errors[v]}
                  </div>
                )
              );
            });
          }
        };

        const inputDiv = (
          <div className={styles.inputContainer}>
            <div className={styles.inputBar}>
              {initialKeys.map(v => {
                return (
                  <input
                    id={v}
                    placeholder={v}
                    type={v === "password" ? "password" : "text"}
                    value={values[v]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors[v] && touched[v]
                        ? styles.textInput + " " + styles.error
                        : styles.textInput
                    }
                  />
                );
              })}
            </div>

            <div className={styles.btnContainer}>
              <button
                type="button"
                className={styles.submit}
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
              >
                Reset
              </button>

              <button
                className={styles.submit}
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Submit
              </button>
            </div>
          </div>
        );

        const thankYouDiv = (
          <div className={styles.inputContainer}>
            <img src={success} height={BUTTON_HEIGHT} alt="v" />
            <h1 className={styles.thank}>
              Thank you. We will contact you soon.
            </h1>
          </div>
        );

        return (
          <Form className={styles.form}>
            <h1
              className={styles.title}
              htmlFor="email"
              style={{ display: "block" }}
            >
              Keep in Touch.
            </h1>
            <h4 className={styles.subtitle}>
              Sign up and we'll send you the latest news from us. No Spam.
            </h4>
            {submitted ? thankYouDiv : inputDiv}
            <br />

            <ShowErrors errors={errors} touched={touched} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default EmailForm;
