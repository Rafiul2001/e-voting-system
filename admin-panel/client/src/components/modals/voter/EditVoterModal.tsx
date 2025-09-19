import { IoMdClose } from "react-icons/io";
import Flex from "../../ui/Flex";
import Text from "../../ui/Text";
import type { TVoter } from "../../../types/VoterTypes";
import { useEffect, useState } from "react";

type TEditVoterModal = {
  isOpen: boolean;
  voterData: Partial<TVoter>;
  onSuccess: (formData: Partial<TVoter>) => void;
  onCancel: () => void;
};

const EditVoterModal: React.FC<TEditVoterModal> = ({
  isOpen,
  voterData,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<TVoter>>({});

  const onChangeFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    setFormData(voterData);
  }, [voterData]);

  return (
    <div className="relative">
      {/* Overlay */}
      <div
        onClick={onCancel}
        className={`fixed inset-0 bg-gray-500/30 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Modal */}
      <div
        className={`fixed z-50 top-1/2 left-1/2 w-full max-w-[500px] p-4 bg-gray-50 rounded-2xl shadow transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2"
            : "opacity-0 scale-95 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        }`}
      >
        <Flex className="items-center justify-between border-b-2 border-gray-200">
          <Text size={4} className="py-4 font-semibold">
            Edit Voter
          </Text>
          <div
            onClick={onCancel}
            className="p-1 text-white bg-rose-500 cursor-pointer hover:bg-rose-600 rounded-md transition-all"
          >
            <IoMdClose size={24} />
          </div>
        </Flex>

        {/* Update Form */}
        <form className="py-2 flex flex-col gap-4">
          <Flex className="flex-col gap-2">
            <label htmlFor="voterName">
              <Text size={5} className="font-semibold">
                Voter Name
              </Text>
            </label>
            <input
              type="text"
              name="voterName"
              id="voterName"
              value={formData.voterName ?? ""}
              placeholder="Enter Voter Name"
              onChange={(e) => onChangeFormData(e)}
              className="border-[2px] border-indigo-300 focus:outline-indigo-500 px-2 py-1 rounded-md focus:text-indigo-700 font-medium"
            />
          </Flex>

          <Flex className="flex-col gap-2">
            <label htmlFor="constituencyId">
              <Text size={5} className="font-semibold">
                Constituency Id
              </Text>
            </label>
            <input
              type="text"
              name="constituencyId"
              id="constituencyId"
              value={formData.constituencyId ?? ""}
              placeholder="Enter Constituency Id"
              onChange={(e) => onChangeFormData(e)}
              className="border-[2px] border-indigo-300 focus:outline-indigo-500 px-2 py-1 rounded-md focus:text-indigo-700 font-medium"
            />
          </Flex>

          <Flex className="flex-col gap-2">
            <label htmlFor="address">
              <Text size={5} className="font-semibold">
                Address
              </Text>
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address ?? ""}
              placeholder="Enter Address"
              onChange={(e) => onChangeFormData(e)}
              className="border-[2px] border-indigo-300 focus:outline-indigo-500 px-2 py-1 rounded-md focus:text-indigo-700 font-medium"
            />
          </Flex>

          <Flex className="gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="text-white px-4 py-1 bg-rose-500 hover:bg-rose-600 cursor-pointer rounded-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSuccess(formData);
              }}
              className="text-white px-4 py-1 bg-teal-500 hover:bg-teal-600 cursor-pointer rounded-sm transition-all"
            >
              Update
            </button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default EditVoterModal;
