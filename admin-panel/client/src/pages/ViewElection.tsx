import { useParams } from "react-router";
import Container from "../components/ui/Container";
import Text from "../components/ui/Text";
import { useCandidateStore } from "../store/candidateStore";
import { useCallback, useEffect, useState } from "react";
import ToastModal from "../components/ToastModal";
import AddCandidateModal from "../components/modals/election/AddCandidateModal";
import type {
  TAddConstituencyForCandidate,
  TCreateCandidate,
  TRemoveConstituencyForCandidate,
} from "../types/candidateType";
import { MdDelete } from "react-icons/md";
import { IoMdAdd, IoMdRemoveCircleOutline } from "react-icons/io";
import AddConstituencyToCandidateModal from "../components/modals/election/AddConstituencyToCandidateModal";
import RemoveConstituencyToCandidateModal from "../components/modals/election/RemoveConstituencyModal";
import DeleteModal from "../components/modals/DeleteModal";

const ViewElection = () => {
  const { electionId } = useParams();

  const {
    candidateList,
    createCandidate,
    setCandidateListByElectionId,
    addConstituency,
    removeConstituency,
    deleteCandidate,
  } = useCandidateStore();

  const [toastMessage, setToastMessage] = useState<{
    type: string;
    toastMessage: string;
  }>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAddConstituencyData, setSelectedAddConstituencyData] =
    useState<{
      candidateId: string;
      electionId: string;
    }>();

  const [selectedRemoveConstituencyData, setSelectedRemoveConstituencyData] =
    useState<{
      candidateId: string;
      electionId: string;
      constituencyList: {
        constituencyNumber: number;
        constituencyName: string;
      }[];
    }>();

  // Delete modal state
  const [deleteFunction, setDeleteFunction] = useState<() => Promise<void>>();

  const handleAddCandidate = useCallback(
    async (newCandidate: TCreateCandidate) => {
      console.log(newCandidate)
      const toast = await createCandidate(newCandidate);
      setToastMessage(toast);
    },
    [createCandidate]
  );

  const handleAddConstituency = useCallback(
    async (newConstituency: TAddConstituencyForCandidate) => {
      const toast = await addConstituency(newConstituency);
      setToastMessage(toast);
    },
    [addConstituency]
  );

  const handleDeleteConstituency = useCallback(
    async (constituency: TRemoveConstituencyForCandidate) => {
      const toast = await removeConstituency(constituency);
      setToastMessage(toast);
    },
    [removeConstituency]
  );

  useEffect(() => {
    if (!electionId) return;

    (async () => {
      await setCandidateListByElectionId(electionId);
    })();
  }, [electionId, setCandidateListByElectionId]);

  return (
    <Container className="relative">
      <Text size={3} className="font-semibold">
        Election Id: {electionId}
      </Text>

      <button
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer px-4 py-1 border border-indigo-500"
      >
        Add Candidate
      </button>

      {/* Candidate Table */}
      <div className="flex flex-col gap-2">
        <ul className="grid grid-cols-6">
          <li>
            <Text size={5}>Sl no.</Text>
          </li>
          <li>
            <Text size={5}>Candidate Id</Text>
          </li>
          <li>
            <Text size={5}>Candidate Name</Text>
          </li>
          <li>
            <Text size={5}>Voter Id</Text>
          </li>
          <li>
            <Text size={5}>Stood for constituencies</Text>
          </li>
          <li>
            <Text size={5}>Actions</Text>
          </li>
        </ul>

        {candidateList.length > 0 &&
          candidateList.map((candidate, index) => {
            return (
              <ul key={index} className="grid grid-cols-6 items-center">
                <li>{index + 1}</li>
                <li>{candidate.candidateId}</li>
                <li>{candidate.candidateName}</li>
                <li>{candidate.voterId}</li>
                <li className="flex flex-wrap items-center justify-center gap-2">
                  {candidate.constituency.map((con, index) => (
                    <span key={index}>{con.constituencyName}</span>
                  ))}
                </li>
                <li className="flex flex-row items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedAddConstituencyData({
                        candidateId: candidate.candidateId,
                        electionId: candidate.electionId,
                      });
                    }}
                    className="p-2 cursor-pointer bg-indigo-500 hover:bg-indigo-800 text-white rounded-3xl"
                  >
                    <IoMdAdd size={24} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRemoveConstituencyData({
                        candidateId: candidate.candidateId,
                        electionId: candidate.electionId,
                        constituencyList: candidate.constituency,
                      });
                    }}
                    className="p-2 cursor-pointer bg-rose-500 hover:bg-rose-800 text-white rounded-3xl"
                  >
                    <IoMdRemoveCircleOutline size={24} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteFunction(() => async () => {
                        const toast = await deleteCandidate(
                          candidate.candidateId,
                          candidate.electionId
                        );
                        setToastMessage(toast);
                      });
                    }}
                    className="p-2 cursor-pointer bg-rose-500 hover:bg-rose-800 text-white rounded-3xl"
                  >
                    <MdDelete size={24} />
                  </button>
                </li>
              </ul>
            );
          })}
      </div>

      <RemoveConstituencyToCandidateModal
        data={selectedRemoveConstituencyData}
        isOpen={!!selectedRemoveConstituencyData}
        onSuccess={handleDeleteConstituency}
        title="Delete Constituency"
        setData={setSelectedRemoveConstituencyData}
      />

      <AddConstituencyToCandidateModal
        data={selectedAddConstituencyData}
        isOpen={!!selectedAddConstituencyData}
        setData={setSelectedAddConstituencyData}
        title="Add Constituency"
        onSuccess={handleAddConstituency}
      />

      <AddCandidateModal
        electionId={electionId ?? ""}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title="Add Candidate"
        onSuccess={handleAddCandidate}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteFunction}
        confirmMessage="Do you want to delete this candidate?"
        onCancel={() => setDeleteFunction(undefined)}
        onDelete={async () => {
          if (deleteFunction) {
            await deleteFunction();
            setDeleteFunction(undefined);
          }
        }}
      />

      {/* Toast Modal */}
      <ToastModal
        type={toastMessage?.type}
        toastMessage={toastMessage?.toastMessage}
        setToastMessage={setToastMessage}
      />
    </Container>
  );
};

export default ViewElection;
