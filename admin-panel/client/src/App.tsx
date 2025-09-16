import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Flex from "./components/ui/Flex";

const App: React.FC = () => {
  return (
    <Flex className="flex-col w-full h-screen">
      <div className="shrink">
        <Header />
      </div>
      <div className="flex-auto">
        <Outlet />
      </div>
      <div className="shrink">
        <Footer />
      </div>
    </Flex>
  );
};

export default App;
