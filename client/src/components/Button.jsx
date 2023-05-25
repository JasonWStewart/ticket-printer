import React from "react";

import styles from "./Button.module.css";

const Button = (props) => {
  return (
    <div onClick={props.clickHandler} className={styles.buttonBox} style={{ backgroundColor: `${props.color}` }}>
      {props.displayText}
    </div>
  );
};

export default Button;
