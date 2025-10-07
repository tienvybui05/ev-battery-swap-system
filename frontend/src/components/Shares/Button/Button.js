import styles from "./Button.module.css";
function Button({ text = false, primary = false, children }) {
  var classes = styles.wrapper;
  if (primary) {
    classes += ` ${styles.primary}`;
  }
  if (text) {
    classes += ` ${styles.text}`;
  }
  return <button className={classes}>{children}</button>;
}
export default Button;
