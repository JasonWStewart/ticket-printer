import Button from "./Button";
import styles from "./ProductButton.module.css";

const ProductButton = (props) => {
  return (
    <Button clickHandler={props.clickHandler} displayText={props.displayText} color={props.color}>
      <div className={styles.priceTag}>{props.price > 0 ? `£${props.price}` : `FREE`}</div>
    </Button>
  );
};

export default ProductButton;
