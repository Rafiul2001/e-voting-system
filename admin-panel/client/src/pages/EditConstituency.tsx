import { useParams } from "react-router";
import Container from "../components/ui/Container";

const EditConstituency: React.FC = () => {
  const { constituencyNumber } = useParams();
  return <Container>EditConstituency {constituencyNumber}</Container>;
};

export default EditConstituency;
