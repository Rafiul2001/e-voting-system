import type { PropsWithChildren } from "react";
import { Link } from "react-router";

const NavItem: React.FC<
  PropsWithChildren & { url: string; className?: string }
> = ({ children, url, className }) => {
  return (
    <li className={className}>
      <Link to={url}>{children}</Link>
    </li>
  );
};

export default NavItem;
