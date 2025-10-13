import styles from "./Button.module.css";
function Button({ text = false, primary = false, blackoutline = false, order = false, small = false, white = false,change = false,icon= false, children }) {
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
  if (change) {
    classes += ` ${styles.change}`;
  }
  if (icon) {
    classes += ` ${styles.icon}`;
  }
  return <button className={classes}>{children}</button>;
}
export default Button;
