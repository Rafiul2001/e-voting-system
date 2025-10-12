import { useParams } from "react-router";
import Container from "../components/ui/Container";
import Text from "../components/ui/Text";
import { useCandidateStore } from "../store/candidateStore";
import { useCallback, useEffect, useState } from "react";
import ToastModal from "../components/ToastModal";
import AddCandidateModal from "../components/modals/election/AddCandidateModal";
import type { TCreateCandidate } from "../types/candidateType";

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

  const handleAddCandidate = useCallback(
    async (newCandidate: TCreateCandidate) => {
      const toast = await createCandidate(newCandidate);
      setToastMessage(toast);
    },
    [createCandidate]
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
        <ul className="grid grid-cols-5">
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
            <Text size={5}>Actions</Text>
          </li>
        </ul>

        {candidateList.length > 0 &&
          candidateList.map((candidate, index) => {
            return (
              <ul key={index} className="grid grid-cols-5 items-center">
                <li>{index + 1}</li>
                <li>{candidate.candidateId}</li>
                <li>{candidate.candidateName}</li>
                <li>{candidate.voterId}</li>
                <li className="flex flex-row items-center gap-3">
                  <button
                    onClick={() => {}}
                    className="cursor-pointer p-2 bg-indigo-500 text-white rounded-md"
                  >
                    Add Constituency
                  </button>
                  <button
                    onClick={() => {}}
                    className="cursor-pointer p-2 bg-teal-500 text-white rounded-md"
                  >
                    Remove Constituency
                  </button>
                  <button
                    onClick={() => {}}
                    className="cursor-pointer p-2 bg-rose-500 text-white rounded-md"
                  >
                    Delete Candidate
                  </button>
                </li>
              </ul>
            );
          })}
      </div>

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
