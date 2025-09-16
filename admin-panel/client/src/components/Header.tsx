import { Link } from "react-router";
import Container from "./ui/Container";
import Flex from "./ui/Flex";
import NavItem from "./ui/NavItem";
import { CiLogout } from "react-icons/ci";
import { FaUser } from "react-icons/fa";

const navItems = [
  { name: "Home", url: "/" },
  { name: "Voter Records", url: "/voter-records" },
  { name: "Candidate Records", url: "/candidate-records" },
  { name: "Election Records", url: "/election-records" },
];

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <Container>
        <Flex className="justify-between items-center">
          {/* Logo / Title */}
          <h3 className="text-2xl font-bold text-blue-700 tracking-wide hover:text-blue-900 transition-colors">
            Election Admin Panel
          </h3>

          {/* Navigation */}
          <ul className="hidden md:flex text-base font-medium gap-6">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                url={item.url}
                className="hover:text-blue-600 transition-colors"
              >
                {item.name}
              </NavItem>
            ))}
          </ul>

          {/* Right Actions */}
          <Flex className="gap-4 items-center">
            <Link
              to="/login"
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all shadow-sm"
            >
              <span className="font-medium">Logout</span>
              <CiLogout size={22} />
            </Link>
            <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <FaUser size={22} className="text-gray-700" />
            </div>
          </Flex>
        </Flex>
      </Container>
    </header>
  );
};

export default Header;
