import styles from "./Button.module.css";
function Button({ text = false, primary = false, blackoutline = false, order = false, small = false, white = false, children }) {
  var classes = styles.wrapper;
  if (primary) {
    classes += ` ${styles.primary}`;
  }
  if (text) {
    classes += ` ${styles.text}`;
  }

  if (blackoutline) {
    classes += ` ${styles.blackoutline}`;
  }

  if (small) {
    classes += ` ${styles.small}`;
  }

  if (order) {
    classes += ` ${styles.order}`;
  }
  if (white) {
    classes += ` ${styles.white}`;
  }
  return <button className={classes}>{children}</button>;
}
export default Button;
