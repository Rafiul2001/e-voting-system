import { useNavigate, useParams } from "react-router";
import Container from "../components/ui/Container";
import { useConstituencyStore } from "../store/constituencyStore";
import { useEffect, useState } from "react";
import Text from "../components/ui/Text";
import Table from "../components/ui/Table";
import ToastModal from "../components/ToastModal";
import type { TConstituencyModel } from "../types/ConstituencyType";

// Types
type WardType = { wardNumber: number };
type UnionType = { unionName: string; wards: number[] };
type UpazilaType = { upazilaName: string; unions: UnionType[] };
type CityCorporationType = { cityCorporationName: string; wards: number[] };

const EditConstituency: React.FC = () => {
  const navigate = useNavigate();
  const { constituencyNumber } = useParams();

  const filter = useConstituencyStore((s) => s.filter);
  const filteredDivisionObject = useConstituencyStore((s) =>
    s.getFilteredDivisionObject()
  );

  const [constituencyObjectToBeUpdate, setConstituencyObjectToBeUpdate] =
    useState<TConstituencyModel>();

  const filteredDistrictList = constituencyObjectToBeUpdate?.districts || [];

  const filteredConstituency = filteredDistrictList
    .find(
      (district) =>
        district.districtName.toLowerCase() ===
        filter.districtName.toLowerCase()
    )
    ?.constituencies.find(
      (c) => c.constituencyNumber === Number(constituencyNumber)
    );

  const [selectedUpazilaName, setSelectedUpazilaName] = useState<string>("");
  const [selectedUnionName, setSelectedUnionName] = useState<string>("");
  const [selectedCityCorporationName, setSelectedCityCorporationName] =
    useState<string>("");

  const filteredUpazila = filteredConstituency?.boundaries.upazilas?.find(
    (upazila) => upazila.upazilaName === selectedUpazilaName
  );

  const filteredUnion = filteredUpazila?.unions.find(
    (union) => union.unionName === selectedUnionName
  );

  const filteredCityCorporation =
    filteredConstituency?.boundaries.cityCorporations?.find(
      (city) => city.cityCorporationName === selectedCityCorporationName
    );

  const [toastMessage, setToastMessage] = useState<{
    type: string;
    toastMessage: string;
  }>();

  useEffect(() => {
    if (!filteredDivisionObject) {
      navigate("/constituency-records");
    } else {
      setConstituencyObjectToBeUpdate(structuredClone(filteredDivisionObject));
    }
  }, [filteredDivisionObject, navigate]);

  // Delete handlers
  const handleDeleteUpazila = (name: string) => {
    if (!filteredConstituency) return;

    filteredConstituency.boundaries.upazilas =
      filteredConstituency.boundaries.upazilas?.filter(
        (upazila) => upazila.upazilaName !== name
      ) || [];

    // Optionally update your store to trigger re-render
    useConstituencyStore.getState().setFilter({ ...filter });
  };

  const handleDeleteUnion = (name: string) => {
    if (!filteredUpazila) return;

    filteredUpazila.unions = filteredUpazila.unions.filter(
      (union) => union.unionName !== name
    );

    useConstituencyStore.getState().setFilter({ ...filter });
  };

  // Delete ward from Union
  const handleDeleteUnionWard = (wardNumber: number) => {
    if (!filteredUnion) return;
    filteredUnion.wards = filteredUnion.wards.filter((w) => w !== wardNumber);

    // Trigger store update or re-render
    useConstituencyStore.getState().setFilter({ ...filter });
  };

  const handleDeleteCity = (name: string) => {
    if (!filteredConstituency) return;

    filteredConstituency.boundaries.cityCorporations =
      filteredConstituency.boundaries.cityCorporations?.filter(
        (city) => city.cityCorporationName !== name
      ) || [];

    useConstituencyStore.getState().setFilter({ ...filter });
  };

  // Delete ward from City Corporation
  const handleDeleteCityWard = (wardNumber: number) => {
    if (!filteredCityCorporation) return;
    filteredCityCorporation.wards = filteredCityCorporation.wards.filter(
      (w) => w !== wardNumber
    );

    // Trigger store update or re-render
    useConstituencyStore.getState().setFilter({ ...filter });
  };

  return (
    <Container className="relative">
      <Text size={2} className="font-semibold mb-2">
        Edit Constituency
      </Text>
      <Text size={3}>Constituency Number: {constituencyNumber}</Text>
      <Text size={4}>Division Name: {filter.divisionName}</Text>
      <Text size={4}>District Name: {filter.districtName}</Text>

      {/* Upazilas Table */}
      {filteredConstituency?.boundaries.upazilas && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <Text size={3} className="font-semibold">
              Upazilas
            </Text>
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Add Upazila
            </button>
          </div>
          <Table<UpazilaType>
            columns={[{ header: "Name", accessor: "upazilaName" }]}
            data={filteredConstituency.boundaries.upazilas}
            onEdit={(row) => setSelectedUpazilaName(row.upazilaName)}
            onDelete={(row) => handleDeleteUpazila(row.upazilaName)}
          />
        </div>
      )}

      {/* Unions Table */}
      {filteredUpazila && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <Text size={3} className="font-semibold">
              Unions of {filteredUpazila.upazilaName}
            </Text>
            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              Add Union
            </button>
          </div>
          <Table<UnionType>
            columns={[{ header: "Name", accessor: "unionName" }]}
            data={filteredUpazila.unions}
            onEdit={(row) => setSelectedUnionName(row.unionName)}
            onDelete={(row) => handleDeleteUnion(row.unionName)}
          />
        </div>
      )}

      {/* Wards Table */}
      {filteredUnion && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <Text size={3} className="font-semibold">
              Wards of {filteredUnion.unionName}
            </Text>
            <button className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600">
              Add Ward
            </button>
          </div>
          <Table<WardType>
            columns={[{ header: "Ward", accessor: "wardNumber" }]}
            data={filteredUnion.wards.map((w) => ({ wardNumber: w }))}
            onDelete={(row) => handleDeleteUnionWard(row.wardNumber)}
          />
        </div>
      )}

      {/* City Corporations Table */}
      {filteredConstituency?.boundaries.cityCorporations && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <Text size={3} className="font-semibold">
              City Corporations
            </Text>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
              Add City Corporation
            </button>
          </div>
          <Table<CityCorporationType>
            columns={[{ header: "Name", accessor: "cityCorporationName" }]}
            data={filteredConstituency.boundaries.cityCorporations}
            onEdit={(row) =>
              setSelectedCityCorporationName(row.cityCorporationName)
            }
            onDelete={(row) => handleDeleteCity(row.cityCorporationName)}
          />
        </div>
      )}

      {/* Wards Table for selected City Corporation */}
      {filteredCityCorporation && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <Text size={3} className="font-semibold">
              Wards of {filteredCityCorporation.cityCorporationName}
            </Text>
            <button className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600">
              Add Ward
            </button>
          </div>
          <Table<WardType>
            columns={[{ header: "Ward", accessor: "wardNumber" }]}
            data={filteredCityCorporation.wards.map((w) => ({ wardNumber: w }))}
            onDelete={(row) => handleDeleteCityWard(row.wardNumber)}
          />
        </div>
      )}

      <button
        onClick={() => {
          if (constituencyObjectToBeUpdate) {
            useConstituencyStore
              .getState()
              .updateConstituency(constituencyObjectToBeUpdate);

          }
        }}
        className="mt-4 bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
      >
        Update
      </button>

      {/* Toast Modal */}
      <ToastModal
        type={toastMessage?.type}
        toastMessage={toastMessage?.toastMessage}
        setToastMessage={setToastMessage}
      />
    </Container>
  );
};

export default EditConstituency;
