import { NavLink as RouterNavLink } from "react-router-dom";

/**
 * Simple NavLink wrapper
 * - supports active & pending class names
 * - no TypeScript
 * - no shadcn utils
 */
function NavLink({
  to,
  className = "",
  activeClassName = "",
  pendingClassName = "",
  ...props
}) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive, isPending }) => {
        let classes = className;

        if (isActive && activeClassName) {
          classes += ` ${activeClassName}`;
        }

        if (isPending && pendingClassName) {
          classes += ` ${pendingClassName}`;
        }

        return classes.trim();
      }}
      {...props}
    />
  );
}

export default NavLink;
