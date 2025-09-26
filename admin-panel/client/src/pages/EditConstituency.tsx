import { useParams } from "react-router";
import Container from "../components/ui/Container";
import { useConstituencyStore } from "../store/constituencyStore";

const EditConstituency: React.FC = () => {
  const { constituencyNumber } = useParams();
  const filter = useConstituencyStore((s) => s.filter);
  const filteredDivisionObject = useConstituencyStore((s) =>
    s.getFilteredDivisionObject()
  );
  const filteredDistrictList = filteredDivisionObject?.districts || [];

  const filteredConstituencyList =
    filteredDistrictList.find(
      (district) =>
        district.districtName.toLowerCase() ===
        filter.districtName.toLowerCase()
    )?.constituencies || [];
  return (
    <Container>
      EditConstituency {constituencyNumber} -{" "}
      {filteredConstituencyList[0].constituencyNumber}
    </Container>
  );
};

export default EditConstituency;
