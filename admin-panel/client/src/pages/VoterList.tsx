import Container from "../components/ui/Container";
import Flex from "../components/ui/Flex";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaAngleLeft, FaAngleRight, FaSearch } from "react-icons/fa";
import Text from "../components/ui/Text";
import { fontWeight } from "../components/utils/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import DeleteModal from "../components/DeleteModal";

type TVoter = {
  voterId: string;
  voterName: string;
  constituencyId: string;
  dateOfBirth: string;
  address: string;
};

const voterListData: TVoter[] = [
  {
    voterId: "VOTER0001",
    voterName: "Shah Md. Rafiul Kadir",
    constituencyId: "CONSID0001",
    dateOfBirth: "1999-05-14",
    address: "Mohammadpur, Dhaka",
  },
  {
    voterId: "VOTER0002",
    voterName: "Md. Shohel Rana",
    constituencyId: "CONSID0001",
    dateOfBirth: "1998-11-20",
    address: "Mirpur, Dhaka",
  },
  {
    voterId: "VOTER0003",
    voterName: "Sajid Hossain Khan",
    constituencyId: "CONSID0002",
    dateOfBirth: "2000-03-08",
    address: "Dhanmondi, Dhaka",
  },
  {
    voterId: "VOTER0004",
    voterName: "Munia Tabassum Supti",
    constituencyId: "CONSID0003",
    dateOfBirth: "2001-07-25",
    address: "Banani, Dhaka",
  },
  {
    voterId: "VOTER0005",
    voterName: "Md. Fatin Ishrak Mahi",
    constituencyId: "CONSID0003",
    dateOfBirth: "1999-09-12",
    address: "Uttara, Dhaka",
  },
  {
    voterId: "VOTER0006",
    voterName: "Minhaj Morshed Chowdhury",
    constituencyId: "CONSID0002",
    dateOfBirth: "1997-01-30",
    address: "Chittagong",
  },
  {
    voterId: "VOTER0007",
    voterName: "Farhana Akter Jui",
    constituencyId: "CONSID0004",
    dateOfBirth: "2000-02-18",
    address: "Barisal",
  },
  {
    voterId: "VOTER0008",
    voterName: "Mahmudul Hasan",
    constituencyId: "CONSID0001",
    dateOfBirth: "1996-08-09",
    address: "Gazipur",
  },
  {
    voterId: "VOTER0009",
    voterName: "Afsana Mim",
    constituencyId: "CONSID0005",
    dateOfBirth: "2002-06-21",
    address: "Sylhet",
  },
  {
    voterId: "VOTER0010",
    voterName: "Rakibul Islam",
    constituencyId: "CONSID0002",
    dateOfBirth: "1995-04-11",
    address: "Rajshahi",
  },
  {
    voterId: "VOTER0011",
    voterName: "Nusrat Jahan",
    constituencyId: "CONSID0004",
    dateOfBirth: "1998-12-28",
    address: "Khulna",
  },
  {
    voterId: "VOTER0012",
    voterName: "Tanvir Ahmed",
    constituencyId: "CONSID0003",
    dateOfBirth: "1997-10-03",
    address: "Comilla",
  },
  {
    voterId: "VOTER0013",
    voterName: "Shamima Akter",
    constituencyId: "CONSID0005",
    dateOfBirth: "1999-07-19",
    address: "Noakhali",
  },
  {
    voterId: "VOTER0014",
    voterName: "Hasibul Kabir",
    constituencyId: "CONSID0006",
    dateOfBirth: "1996-03-27",
    address: "Jessore",
  },
  {
    voterId: "VOTER0015",
    voterName: "Tahmina Haque",
    constituencyId: "CONSID0006",
    dateOfBirth: "2001-01-15",
    address: "Mymensingh",
  },
  {
    voterId: "VOTER0016",
    voterName: "Arifur Rahman",
    constituencyId: "CONSID0002",
    dateOfBirth: "1994-09-05",
    address: "Bogura",
  },
];

type TFilter = {
  searchText: string;
  pageNumber: number;
};

const VoterList: React.FC = () => {
  const [voterList, setVoterList] = useState<TVoter[]>([]);
  const [filteredVoterList, setFilteredVoterList] = useState<TVoter[]>([]);

  const [filter, setFilter] = useState<TFilter>({
    searchText: "",
    pageNumber: 1,
  });

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

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

  const onCancel = () => {
    setIsOpenDeleteModal(false);
  };
  const onDelete = () => {
    // TODO: Handle Delete Operation
    setIsOpenDeleteModal(false);
  };

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
                    <div
                      onClick={() => setIsOpenDeleteModal(true)}
                      className="p-2 cursor-pointer bg-rose-500 hover:bg-rose-800 text-white rounded-3xl"
                    >
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

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isOpenDeleteModal}
        onCancel={onCancel}
        onDelete={onDelete}
        confirmMessage="Want to delete"
      />
    </Container>
  );
};

export default VoterList;
