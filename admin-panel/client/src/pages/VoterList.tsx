import Container from "../components/ui/Container";
import Flex from "../components/ui/Flex";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaAngleLeft, FaAngleRight, FaSearch } from "react-icons/fa";
import Text from "../components/ui/Text";
import { fontWeight } from "../components/utils/utils";
import { useCallback, useEffect, useRef, useState } from "react";

const voterListData = [
  {
    voterId: "VOTER0001",
    voterName: "Shah Md. Rafiul Kadir",
    constituencyId: "CONSID0001",
  },
  {
    voterId: "VOTER0002",
    voterName: "Md. Shohel Rana",
    constituencyId: "CONSID0001",
  },
  {
    voterId: "VOTER0003",
    voterName: "Sajid Hossain Khan",
    constituencyId: "CONSID0002",
  },
  {
    voterId: "VOTER0004",
    voterName: "Munia Tabassum Supti",
    constituencyId: "CONSID0003",
  },
  {
    voterId: "VOTER0005",
    voterName: "Md. Fatin Ishrak Mahi",
    constituencyId: "CONSID0003",
  },
  {
    voterId: "VOTER0006",
    voterName: "Minhaj Morshed Chowdhury",
    constituencyId: "CONSID0002",
  },
  {
    voterId: "VOTER0001",
    voterName: "Shah Md. Rafiul Kadir",
    constituencyId: "CONSID0001",
  },
  {
    voterId: "VOTER0002",
    voterName: "Md. Shohel Rana",
    constituencyId: "CONSID0001",
  },
  {
    voterId: "VOTER0003",
    voterName: "Sajid Hossain Khan",
    constituencyId: "CONSID0002",
  },
  {
    voterId: "VOTER0004",
    voterName: "Munia Tabassum Supti",
    constituencyId: "CONSID0003",
  },
  {
    voterId: "VOTER0005",
    voterName: "Md. Fatin Ishrak Mahi",
    constituencyId: "CONSID0003",
  },
  {
    voterId: "VOTER0006",
    voterName: "Minhaj Morshed Chowdhury",
    constituencyId: "CONSID0002",
  },
];

type TFilter = {
  searchText: string;
  pageNumber: number;
};

type TVoter = {
  voterId: string;
  voterName: string;
  constituencyId: string;
};

const VoterList: React.FC = () => {
  const [voterList, setVoterList] = useState<TVoter[]>([]);
  const [filteredVoterList, setFilteredVoterList] = useState<TVoter[]>([]);

  const [filter, setFilter] = useState<TFilter>({
    searchText: "",
    pageNumber: 1,
  });

  const tableDataStartsRef = useRef<HTMLTableElement>(null);

  const tableData = filter.searchText ? filteredVoterList : voterList;
  const totalData: number = tableData.length;
  const rowCount: number = 10;
  const pageCount: number = Math.ceil(totalData / rowCount);

  const handleFilter = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter((state) => ({
        ...state,
        searchText: e.target.value,
      }));
    },
    []
  );

  useEffect(() => {
    setVoterList(voterListData);
  }, []);

  useEffect(() => {
    const filterList = voterList.filter(
      (voter) =>
        voter.voterId.toLowerCase().includes(filter.searchText.toLowerCase()) ||
        voter.voterName.toLowerCase().includes(filter.searchText.toLowerCase())
    );
    setFilteredVoterList(filterList);
  }, [filter, voterList]);

  return (
    <Container>
      <Text
        size={3}
        weight={fontWeight.semiBold}
        color="primary"
        className="my-4"
      >
        Voter List
      </Text>
      <form className="max-w-xl rounded-4xl px-4 py-2 shadow border-2 border-gray-100">
        <Flex className="gap-2 items-center">
          <div>
            <FaSearch color="gray" size={20} />
          </div>
          <input
            type="search"
            name="voter"
            id="voter"
            placeholder="Search by ID or Name"
            value={filter.searchText}
            onChange={(e) => handleFilter(e)}
            className="w-full outline-0 border-0 text-xl"
          />
        </Flex>
      </form>
      <table
        ref={tableDataStartsRef}
        className="table-auto text-left w-full rounded-md overflow-hidden mt-5"
      >
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="w-10 p-2 text-center">No.</th>
            <th className="w-52">Voter Id</th>
            <th>Voter Name</th>
            <th className="w-32 text-center">Constituency Id</th>
            <th className="text-center w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData
            .slice(
              (filter.pageNumber - 1) * rowCount + 1,
              filter.pageNumber * rowCount + 1
            )
            .map((voter, index) => (
              <tr key={index} className="odd:bg-gray-100 even:bg-gray-200">
                <td className="p-2 text-center">{index + 1}</td>
                <td>{voter.voterId}</td>
                <td>{voter.voterName}</td>
                <td className="text-center">{voter.constituencyId}</td>
                <td className="text-center p-2">
                  <Flex className="gap-3 justify-center">
                    <div className="p-2 cursor-pointer bg-indigo-500 hover:bg-indigo-800 text-white rounded-3xl">
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

      <Flex className="items-center justify-end mt-3">
        <Text size={6}>Pages</Text>
        <FaAngleLeft cursor="pointer" size={20} />
        <Flex className="items-center gap-2">
          {[...Array(pageCount)].map((_, i) => (
            <Text
              key={i}
              onClick={() => {
                setFilter((state) => ({ ...state, pageNumber: i + 1 }));
                tableDataStartsRef.current?.scrollIntoView({
                  behavior: "smooth",
                });
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
        <FaAngleRight cursor="pointer" size={20} />
      </Flex>
    </Container>
  );
};

export default VoterList;
