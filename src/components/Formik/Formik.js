import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Yup from "yup";

import Email from "./templates/Email";
import Generic from "./templates/Generic";
import Login from "./templates/Login";
import Signup from "./templates/Signup";
import Text from "./templates/Text";

const Animated = ({ children, animKey }) => (
  <motion.div
    key={animKey}
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
    exit={{ opacity: 0, y: -100 }}
  >
    {children}
  </motion.div>
);

const Form = ({
  template = "generic",
  initData,
  validationSchema,
  onSubmit,
  key,
  ...props
}) => {
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
        <Animated animKey={key || "email"}>
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
        </Animated>
      );
    case "login":
      return (
        <Animated animKey={key || "login"}>
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
        </Animated>
      );
    case "signup":
      return (
        <Animated animKey={key || "login"}>
          <Signup
            theme="default"
            initialValues={
              initData || { email: "", password: "", nickname: "" }
            }
            validationSchema={
              validationSchema ||
              Yup.object().shape({
                nickname: Yup.string().required("what should we call you?"),
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
        </Animated>
      );

    case "text":
      return (
        <Animated animKey={key || "text"}>
          <Text
            theme="default"
            initialValues={initData || { text: "" }}
            validationSchema={
              validationSchema ||
              Yup.object().shape({
                text: Yup.string().min(5)
              })
            }
            onSubmit={onSubmit || handleSubmit}
            {...props}
          />
        </Animated>
      );

    default:
      return (
        <Animated animKey={key || "generic"}>
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
        </Animated>
      );
  }
};

const AnimatedForm = props => {
  return (
    <AnimatePresence>
      <Form {...props} />
    </AnimatePresence>
  );
};

export default AnimatedForm;
