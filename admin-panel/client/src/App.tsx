import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Flex from "./components/ui/Flex";

const App: React.FC = () => {
  return (
    <Flex className="flex-col w-full h-screen relative">
      <Header />
      <div className="flex-auto">
        <Outlet />
      </div>
      <Footer />
    </Flex>
  );
};

export default App;
