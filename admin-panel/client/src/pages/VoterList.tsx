import Container from "../components/ui/Container";
import Flex from "../components/ui/Flex";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaAngleLeft, FaAngleRight, FaSearch } from "react-icons/fa";
import Text from "../components/ui/Text";
import { fontWeight } from "../components/utils/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TVoter } from "../types/VoterTypes";
import ToastModal from "../components/ToastModal";
import EditVoterModal from "../components/modals/voter/EditVoterModal";
import DeleteModal from "../components/modals/DeleteModal";
import AddVoterModal from "../components/modals/voter/AddVoterModal";

const voterListData: TVoter[] = [
  {
    _id: "a1f92c",
    voterId: "VOTER0001",
    voterName: "Shah Md. Rafiul Kadir",
    constituencyId: "CONSID0001",
    dateOfBirth: "1999-05-14",
    address: "Mohammadpur, Dhaka",
  },
  {
    _id: "b3e47d",
    voterId: "VOTER0002",
    voterName: "Md. Shohel Rana",
    constituencyId: "CONSID0001",
    dateOfBirth: "1998-11-20",
    address: "Mirpur, Dhaka",
  },
  {
    _id: "c9a51f",
    voterId: "VOTER0003",
    voterName: "Sajid Hossain Khan",
    constituencyId: "CONSID0002",
    dateOfBirth: "2000-03-08",
    address: "Dhanmondi, Dhaka",
  },
  {
    _id: "d4b82a",
    voterId: "VOTER0004",
    voterName: "Munia Tabassum Supti",
    constituencyId: "CONSID0003",
    dateOfBirth: "2001-07-25",
    address: "Banani, Dhaka",
  },
  {
    _id: "e7f65c",
    voterId: "VOTER0005",
    voterName: "Md. Fatin Ishrak Mahi",
    constituencyId: "CONSID0003",
    dateOfBirth: "1999-09-12",
    address: "Uttara, Dhaka",
  },
  {
    _id: "f2c18b",
    voterId: "VOTER0006",
    voterName: "Minhaj Morshed Chowdhury",
    constituencyId: "CONSID0002",
    dateOfBirth: "1997-01-30",
    address: "Chittagong",
  },
  {
    _id: "g8e73d",
    voterId: "VOTER0007",
    voterName: "Farhana Akter Jui",
    constituencyId: "CONSID0004",
    dateOfBirth: "2000-02-18",
    address: "Barisal",
  },
  {
    _id: "h5a92f",
    voterId: "VOTER0008",
    voterName: "Mahmudul Hasan",
    constituencyId: "CONSID0001",
    dateOfBirth: "1996-08-09",
    address: "Gazipur",
  },
  {
    _id: "i7d34a",
    voterId: "VOTER0009",
    voterName: "Afsana Mim",
    constituencyId: "CONSID0005",
    dateOfBirth: "2002-06-21",
    address: "Sylhet",
  },
  {
    _id: "j9b62e",
    voterId: "VOTER0010",
    voterName: "Rakibul Islam",
    constituencyId: "CONSID0002",
    dateOfBirth: "1995-04-11",
    address: "Rajshahi",
  },
  {
    _id: "k3f41c",
    voterId: "VOTER0011",
    voterName: "Nusrat Jahan",
    constituencyId: "CONSID0004",
    dateOfBirth: "1998-12-28",
    address: "Khulna",
  },
  {
    _id: "l6a58d",
    voterId: "VOTER0012",
    voterName: "Tanvir Ahmed",
    constituencyId: "CONSID0003",
    dateOfBirth: "1997-10-03",
    address: "Comilla",
  },
  {
    _id: "m4e71b",
    voterId: "VOTER0013",
    voterName: "Shamima Akter",
    constituencyId: "CONSID0005",
    dateOfBirth: "1999-07-19",
    address: "Noakhali",
  },
  {
    _id: "n2c93f",
    voterId: "VOTER0014",
    voterName: "Hasibul Kabir",
    constituencyId: "CONSID0006",
    dateOfBirth: "1996-03-27",
    address: "Jessore",
  },
  {
    _id: "o5b14d",
    voterId: "VOTER0015",
    voterName: "Tahmina Haque",
    constituencyId: "CONSID0006",
    dateOfBirth: "2001-01-15",
    address: "Mymensingh",
  },
  {
    _id: "p7f82a",
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

  const [voterObjectId, setVoterObjectId] = useState<string>("");

  const [voterToBeEdited, setVoterToBeEdited] = useState<Partial<TVoter>>();

  const [isOpenAddVoterModal, setIsOpenAddVoterModal] =
    useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<{
    type: string;
    toastMessage: string;
  }>();

  const tableDataStartsRef = useRef<HTMLTableElement>(null);

  const tableData = filter.searchText ? filteredVoterList : voterList;
  const totalData: number = tableData.length;
  const rowCount: number = 10;
  const pageCount: number = Math.ceil(totalData / rowCount);

  const handleSearchFilter = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter((state) => ({
        ...state,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const onCancel = () => {
    setVoterObjectId("");
  };
  const onDelete = useCallback(async () => {
    // TODO: Handle Delete Operation
    setToastMessage({
      type: "Success",
      toastMessage: `Deleted With object id: ${voterObjectId}`,
    });
    setVoterObjectId("");
  }, [voterObjectId]);

  const updateVoter = useCallback(async (updatedVoterData: Partial<TVoter>) => {
    // TODO: Update Voter Operation
    console.log(updatedVoterData);
    setVoterToBeEdited(undefined);
    setToastMessage({
      type: "Success",
      toastMessage: "Update Successful",
    });
  }, []);

  const addVoter = useCallback(async (voterFromData: Partial<TVoter>) => {
    // TODO: Handle Voter Add Operation
    console.log(voterFromData);
    setToastMessage({
      type: "Success",
      toastMessage: "Successfully Added",
    });
  }, []);

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
    <Container className="relative overflow-hidden">
      <Flex className="items-end justify-between">
        <Flex className="flex-1 flex-col gap-4">
          <Text
            size={3}
            weight={fontWeight.semiBold}
            color="primary"
            className="my-4 p-2"
          >
            Voter List
          </Text>
          <form className="max-w-xl w-full rounded-4xl px-4 py-2 shadow border-2 border-gray-100">
            <Flex className="gap-2 items-center">
              <div>
                <FaSearch color="gray" size={20} />
              </div>
              <input
                type="search"
                name="searchText"
                id="searchText"
                placeholder="Search by ID or Name"
                value={filter.searchText}
                onChange={(e) => handleSearchFilter(e)}
                className="w-full outline-0 border-0 text-xl"
              />
            </Flex>
          </form>
        </Flex>
        <div className="shrink">
          <button
            onClick={() => setIsOpenAddVoterModal(true)}
            className="bg-teal-500 hover:bg-teal-700 cursor-pointer text-white px-10 py-2 rounded-md font-semibold text-xl"
          >
            Add Voter
          </button>
        </div>
      </Flex>
      <div className="text-nowrap overflow-x-auto">
        <table
          ref={tableDataStartsRef}
          className="table-auto text-left w-full rounded-md overflow-hidden mt-5"
        >
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="w-10 p-2 text-center">No.</th>
              <th className="w-52 p-2">Voter Id</th>
              <th className="p-2">Voter Name</th>
              <th className="w-32 text-center p-2">Constituency Id</th>
              <th className="text-center w-[100px] p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData
              .slice(
                (filter.pageNumber - 1) * rowCount,
                filter.pageNumber * rowCount
              )
              .map((voter, index) => (
                <tr key={index} className="odd:bg-gray-100 even:bg-gray-200">
                  <td className="p-2 text-center">{index + 1}</td>
                  <td className="p-2">{voter.voterId}</td>
                  <td className="p-2">{voter.voterName}</td>
                  <td className="text-center">{voter.constituencyId}</td>
                  <td className="text-center p-2">
                    <Flex className="gap-3 justify-center">
                      <div
                        onClick={() => {
                          setVoterToBeEdited(voter);
                        }}
                        className="p-2 cursor-pointer bg-indigo-500 hover:bg-indigo-800 text-white rounded-3xl"
                      >
                        <CiEdit size={24} />
                      </div>
                      <div
                        onClick={() => setVoterObjectId(voter._id)}
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
      </div>

      <Flex className="items-center gap-4 justify-end mt-3">
        <Text size={6}>Pages</Text>
        <FaAngleLeft
          cursor="pointer"
          size={20}
          onClick={() => {
            setFilter((state) => ({
              ...state,
              pageNumber:
                state.pageNumber > 1 ? state.pageNumber - 1 : state.pageNumber,
            }));
          }}
        />
        <Flex className="items-center gap-2">
          {[...Array(pageCount)].map((_, i) => (
            <Text
              key={i}
              onClick={() => {
                setFilter((state) => ({ ...state, pageNumber: i + 1 }));

                if (tableDataStartsRef.current) {
                  const y =
                    tableDataStartsRef.current.getBoundingClientRect().top +
                    window.scrollY -
                    200; // offset from top
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
            setFilter((state) => ({
              ...state,
              pageNumber:
                state.pageNumber < pageCount ? state.pageNumber + 1 : pageCount,
            }));
          }}
        />
      </Flex>

      {/* Tost Modal */}
      <ToastModal
        type={toastMessage?.type}
        toastMessage={toastMessage?.toastMessage}
        setToastMessage={setToastMessage}
      />

      {/* Add Voter Modal */}
      <AddVoterModal
        isOpen={isOpenAddVoterModal}
        setIsOpen={setIsOpenAddVoterModal}
        onSuccess={addVoter}
      />

      {/* Edit Voter Modal */}
      <EditVoterModal
        isOpen={!!voterToBeEdited}
        voterData={voterToBeEdited ?? {}}
        onCancel={() => {
          setVoterToBeEdited(undefined);
        }}
        onSuccess={updateVoter}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!voterObjectId}
        onCancel={onCancel}
        onDelete={onDelete}
        confirmMessage="Want to delete"
      />
    </Container>
  );
};

export default VoterList;
