import React from "react";

import styles from "./ButtonContainer.module.css";

const ButtonContainer = (props) => {
  return <div className={styles.buttonContainer}>{props.children}</div>;
};

export default ButtonContainer;
