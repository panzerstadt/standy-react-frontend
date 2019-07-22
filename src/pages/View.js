import React from "react";

import styles from "./View.module.css";

import { AR_VIEW, VR_DASHBOARD } from "../constants";
import VR_IMG from "../assets/vr.png";
import AR_IMG from "../assets/ar.png";

const View = ({ user }) => {
  return (
    <div className={styles.container}>
      <a
        className={styles.imgContainer}
        href={VR_DASHBOARD + "?email=" + user}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className={styles.img}
          src={VR_IMG}
          alt="link to personalised VR site"
        />
        <h3 className={styles.text}>VR dashboard view</h3>
      </a>

      <a
        className={styles.imgContainer}
        href={AR_VIEW}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className={styles.img} src={AR_IMG} alt="link to AR site" />
        <h3 className={styles.text}>AR view</h3>
      </a>
    </div>
  );
};

export default View;
