import React from "react";

import styles from "./AdminScreen.module.css";
import Button from "./Button";
import ButtonContainer from "./ButtonContainer";

const AdminScreen = (props) => {
  return (
    <div className={styles.adminScreen}>
      <div className={styles.leftSideSplit}>
        <ButtonContainer>
          <Button clickHandler={props.wipeDatabaseHandler} displayText="WIPE DATABASE" color="#cc3333" wide={true} />
          <Button clickHandler={props.changeTicketSetHandler} displayText="CHANGE TICKET SET" color="#339999" wide={true} />
          <Button clickHandler={props.foodHandler} displayText="PRINT FOOD VOUCHER" color="#339999" wide={true} />
        </ButtonContainer>
      </div>
      <div className={styles.rightSideSplit}>
        <Button clickHandler={props.serialiseHandler} displayText="SERIALISE DATABASE" color="#333399" wide={true} />
        <Button clickHandler={props.adminOffHandler} displayText="EXIT ADMIN MENU" color="#339933" wide={true} />
      </div>
    </div>
  );
};

export default AdminScreen;
