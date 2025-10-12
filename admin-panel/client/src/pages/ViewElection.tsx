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
} from "../types/candidateType";
import { MdDelete } from "react-icons/md";
import { IoMdAdd, IoMdRemoveCircleOutline } from "react-icons/io";
import AddConstituencyToCandidateModal from "../components/modals/election/AddConstituencyToCandidateModal";

const ViewElection = () => {
  const { electionId } = useParams();

  const {
    candidateList,
    createCandidate,
    setCandidateListByElectionId,
    setCandidateListByConstituency,
    addConstituency,
    removeConstituency,
    deleteCandidate,
  } = useCandidateStore();

  const [toastMessage, setToastMessage] = useState<{
    type: string;
    toastMessage: string;
  }>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddConstituencyModalOpen, setIsAddConstituencyModalOpen] =
    useState(false);

  const handleAddCandidate = useCallback(
    async (newCandidate: TCreateCandidate) => {
      const toast = await createCandidate(newCandidate);
      setToastMessage(toast);
    },
    [createCandidate]
  );

  const handleAddConstituency = useCallback(
    async (newConstituency: TAddConstituencyForCandidate) => {
      const toast = await addConstituency(
        newConstituency.electionId,
        newConstituency.candidateId,
        newConstituency
      );
      setToastMessage(toast);
    },
    [addConstituency]
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
                    onClick={() => {}}
                    className="p-2 cursor-pointer bg-indigo-500 hover:bg-indigo-800 text-white rounded-3xl"
                  >
                    <IoMdAdd size={24} />
                  </button>
                  <button
                    onClick={() => {}}
                    className="p-2 cursor-pointer bg-rose-500 hover:bg-rose-800 text-white rounded-3xl"
                  >
                    <IoMdRemoveCircleOutline size={24} />
                  </button>
                  <button
                    onClick={async () => {
                      const toast = await deleteCandidate(
                        candidate.candidateId,
                        candidate.electionId
                      );
                      setToastMessage(toast);
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

      <AddConstituencyToCandidateModal
        isOpen={isAddConstituencyModalOpen}
        setIsOpen={setIsAddConstituencyModalOpen}
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
