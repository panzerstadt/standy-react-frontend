import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import Email from "./templates/Email";
import Generic from "./templates/Generic";
import Login from "./templates/Login";

const Form = ({
  template = "generic",
  initData,
  validationSchema,
  onSubmit,
  ...props
}) => {
  const [initVals, setInitVals] = useState();

  const handleSubmit = (values, props) => {
    console.log("additional props from formik!");
    console.log(props);

    setTimeout(() => {
      console.log(JSON.stringify(values, null, 2));
      props.setSubmitting(false);
    }, 500);
  };

  switch (template) {
    case "email":
      return (
        <Email
          theme="default"
          initialValues={initData || { email: "" }}
          validationSchema={
            validationSchema ||
            Yup.object().shape({
              email: Yup.string()
                .email()
                .required("email required!")
            })
          }
          onSubmit={onSubmit || handleSubmit}
          {...props}
        />
      );
    case "login":
      return (
        <Login
          theme="default"
          initialValues={initData || { email: "", password: "" }}
          validationSchema={
            validationSchema ||
            Yup.object().shape({
              email: Yup.string()
                .email()
                .required("email required!"),
              password: Yup.mixed()
                .strict()
                .required("password required!")
            })
          }
          onSubmit={onSubmit || handleSubmit}
          {...props}
        />
      );

    default:
      return (
        <Generic
          theme="default"
          initialValues={
            initData || {
              name: "",
              email: "",
              description: "",
              city: "",
              dateOfBirth: ""
            }
          }
          validationSchema={
            validationSchema ||
            Yup.object().shape({
              name: Yup.string().required(),
              email: Yup.string()
                .email()
                .required(),
              description: Yup.string().min(5),
              city: Yup.string().min(5),
              dateOfBirth: Yup.date()
            })
          }
          {...props}
        />
      );
  }
};

export default Form;
