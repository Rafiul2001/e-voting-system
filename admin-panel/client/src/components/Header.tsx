import { Link } from "react-router";
import Container from "./ui/Container";
import Flex from "./ui/Flex";
import NavItem from "./ui/NavItem";
import { CiLogout } from "react-icons/ci";
import { FaUser } from "react-icons/fa";

const navItems = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Voter Records",
    url: "/voter-records",
  },
  {
    name: "Candidate Records",
    url: "/candidate-records",
  },
  {
    name: "Election Records",
    url: "/election-records",
  },
];

const Header: React.FC = () => {
  return (
    <Container>
      <Flex className="justify-between items-center py-2 px-2">
        <h3 className="text-2xl">Election Admin Panel</h3>
        <ul className="flex text-lg gap-5">
          {navItems.map((item, index) => (
            <NavItem key={index} url={item.url}>
              {item.name}
            </NavItem>
          ))}
        </ul>
        <Flex className="gap-3">
          <Link to="/login">
            <Flex className="gap-1">
              <h3>Logout</h3>
              <CiLogout size={24} />
            </Flex>
          </Link>
          <FaUser size={24} />
        </Flex>
      </Flex>
    </Container>
  );
};

export default Header;
