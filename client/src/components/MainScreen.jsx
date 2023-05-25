import React from "react";

import styles from "./MainScreen.module.css";

const MainScreen = (props) => {
  return <div className={styles.screenContainer}>{props.children}</div>;
};

export default MainScreen;
