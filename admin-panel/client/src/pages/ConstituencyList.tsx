import Container from "../components/ui/Container";
import Flex from "../components/ui/Flex";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Text from "../components/ui/Text";
import { fontWeight } from "../components/utils/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import ToastModal from "../components/ToastModal";
import { useNavigate } from "react-router";
import { useConstituencyStore } from "../store/constituencyStore";

const ConstituencyList: React.FC = () => {
  const navigate = useNavigate();

  const divisionList = useConstituencyStore((s) => s.divisionList);
  const setDivisionList = useConstituencyStore((s) => s.setDivisionList);
  const filter = useConstituencyStore((s) => s.filter);
  const setFilter = useConstituencyStore((s) => s.setFilter);

  const tableDataStartsRef = useRef<HTMLTableElement>(null);
  const [toastMessage, setToastMessage] = useState<{
    type: string;
    toastMessage: string;
  }>();

  // Update division list once on mount
  useEffect(() => {
    setDivisionList();
  }, [setDivisionList]);

  // Handle filter changes
  const handleFilter = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFilter({
        ...filter,
        [e.target.name]: e.target.value,
        pageNumber: 1, // reset page when filter changes
      });
    },
    [filter, setFilter]
  );

  const filteredDivisionObject = useConstituencyStore((s) =>
    s.getFilteredDivisionObject()
  );

  // Compute filtered lists inside component (no infinite loop)
  const filteredDistrictList = filteredDivisionObject?.districts || [];

  const filteredConstituencyList =
    filteredDistrictList.find(
      (district) =>
        district.districtName.toLowerCase() ===
        filter.districtName.toLowerCase()
    )?.constituencies || [];

  const tableData = filteredConstituencyList;
  const totalData: number = tableData.length;
  const rowCount: number = 10;
  const pageCount: number = Math.ceil(totalData / rowCount);

  return (
    <Container className="relative overflow-hidden">
      <Flex className="items-end justify-between">
        <Flex className="flex-1 flex-col gap-4">
          <Text
            size={3}
            weight={fontWeight.semiBold}
            color="primary"
            className="my-4 p-2"
          >
            Constituency List
          </Text>

          <form className="max-w-xl w-full">
            {/* Division Select */}
            <Flex className="w-full">
              <label className="flex-1" htmlFor="divisionName">
                Select Division
              </label>
              <select
                name="divisionName"
                id="divisionName"
                value={filter.divisionName}
                onChange={handleFilter}
                className="flex-1 max-w-[200px] p-2 rounded-xs border border-black"
              >
                <option value="">--</option>
                {divisionList.map((division, index) => (
                  <option
                    key={division.divisionName + index}
                    value={division.divisionName}
                  >
                    {division.divisionName}
                  </option>
                ))}
              </select>
            </Flex>

            {/* District Select */}
            <Flex className="w-full">
              <label className="flex-1" htmlFor="districtName">
                Select District
              </label>
              <select
                name="districtName"
                id="districtName"
                value={filter.districtName}
                onChange={handleFilter}
                className="flex-1 max-w-[200px] p-2 rounded-xs border border-black"
              >
                <option value="">--</option>
                {filteredDistrictList.map((district, index) => (
                  <option
                    key={district.districtName + index}
                    value={district.districtName}
                  >
                    {district.districtName}
                  </option>
                ))}
              </select>
            </Flex>
          </form>
        </Flex>

        <div className="shrink">
          <button className="bg-teal-500 hover:bg-teal-700 cursor-pointer text-white px-10 py-2 rounded-md font-semibold text-xl">
            Add a constituency
          </button>
        </div>
      </Flex>

      {/* Table */}
      <div className="text-nowrap overflow-x-auto">
        <table
          ref={tableDataStartsRef}
          className="table-auto text-left w-full rounded-md overflow-hidden mt-5"
        >
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="w-10 p-2 text-center">Sl No.</th>
              <th className="w-8 p-2 text-center">Constituency Number</th>
              <th className="w-8 p-2 text-center">Constituency Name</th>
              <th className="p-2 text-center">Upazilas or City Corporations</th>
              <th className="w-[100px] text-center p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData
              .slice(
                (filter.pageNumber - 1) * rowCount,
                filter.pageNumber * rowCount
              )
              .map((constituency, index) => (
                <tr key={index} className="odd:bg-gray-100 even:bg-gray-200">
                  <td className="p-2 text-center">{index + 1}</td>
                  <td className="p-2 text-center">
                    {constituency.constituencyNumber}
                  </td>
                  <td className="p-2 text-center">
                    {constituency.constituencyName}
                  </td>
                  <td className="p-2 text-center flex flex-wrap items-center justify-center">
                    {constituency.boundaries.cityCorporations?.map(
                      (city, idx) => (
                        <span key={city.cityCorporationName + idx}>
                          {city.cityCorporationName}
                        </span>
                      )
                    )}
                    {constituency.boundaries.upazilas?.map((upazila, idx) => (
                      <span key={upazila.upazilaName + idx}>
                        {upazila.upazilaName}
                      </span>
                    ))}
                  </td>
                  <td className="text-center p-2">
                    <Flex className="gap-3 justify-center">
                      <div
                        onClick={() =>
                          navigate(`${constituency.constituencyNumber}`)
                        }
                        className="p-2 cursor-pointer bg-indigo-500 hover:bg-indigo-800 text-white rounded-3xl"
                      >
                        <CiEdit size={24} />
                      </div>
                      <div className="p-2 cursor-pointer bg-rose-500 hover:bg-rose-800 text-white rounded-3xl">
                        <MdDelete size={24} />
                      </div>
                    </Flex>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Flex className="items-center gap-4 justify-end mt-3">
        <Text size={6}>Pages</Text>
        <FaAngleLeft
          cursor="pointer"
          size={20}
          onClick={() => {
            setFilter({
              ...filter,
              pageNumber: Math.max(filter.pageNumber - 1, 1),
            });
          }}
        />
        <Flex className="items-center gap-2">
          {[...Array(pageCount)].map((_, i) => (
            <Text
              key={i}
              onClick={() => {
                setFilter({ ...filter, pageNumber: i + 1 });
                if (tableDataStartsRef.current) {
                  const y =
                    tableDataStartsRef.current.getBoundingClientRect().top +
                    window.scrollY -
                    200;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              weight={fontWeight.semiBold}
              className={`px-2 py-1 cursor-pointer ${
                filter.pageNumber === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              } rounded-md`}
            >
              {i + 1}
            </Text>
          ))}
        </Flex>
        <FaAngleRight
          cursor="pointer"
          size={20}
          onClick={() => {
            setFilter({
              ...filter,
              pageNumber: Math.min(filter.pageNumber + 1, pageCount),
            });
          }}
        />
      </Flex>

      {/* Toast Modal */}
      <ToastModal
        type={toastMessage?.type}
        toastMessage={toastMessage?.toastMessage}
        setToastMessage={setToastMessage}
      />
    </Container>
  );
};

export default ConstituencyList;
