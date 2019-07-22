import React from "react";
import QRCode from "qrcode.react";

import styles from "./Share.module.css";

import { VR_DASHBOARD } from "../constants";

const Share = ({ user }) => {
  return (
    <div className={styles.container}>
      <QRCode value={VR_DASHBOARD + "?user=" + user} />
      <h3>share this with your friends!</h3>
    </div>
  );
};

export default Share;
