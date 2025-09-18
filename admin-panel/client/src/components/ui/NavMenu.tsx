import type { PropsWithChildren } from "react";

const NavMenu: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <nav className="hidden lg:flex text-base font-medium gap-6">{children}</nav>
  );
};

export default NavMenu;
