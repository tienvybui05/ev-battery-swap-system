import styles from "./Button.module.css";
function Button({
  text = false,
  primary = false,
  blackoutline = false,
  order = false,
  small = false,
  white = false,
  change = false,
  icon = false,
  outline = false,
  type = "button",
  className = "",
  onClick,
  children,
  ...rest
}) {
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
  if (outline) {
    classes += ` ${styles.outline}`;
  }
  return <button
    type={type}
    className={classes}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>;
}
export default Button;
