import React from "react";

import styles from "./Button.module.css";

const Button = (props) => {
  const styleObject = { backgroundColor: `${props.color}` };
  if (props.wide) {
    styleObject.width = "100%";
  }
  return (
    <div onClick={props.clickHandler} className={styles.buttonBox} style={styleObject}>
      <div className={styles.buttonOverlay}>{props.children}</div>
      <div className={styles.displayTextContainer}>{props.displayText}</div>
    </div>
  );
};

export default Button;
