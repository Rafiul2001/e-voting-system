import { IoMdClose } from "react-icons/io";
import Flex from "./ui/Flex";
import Text from "./ui/Text";

type TConfirmModal = {
  isOpen: boolean;
  confirmMessage: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ConfirmModal: React.FC<TConfirmModal> = ({
  isOpen,
  confirmMessage,
  onSuccess,
  onCancel,
}) => {
  return (
    <div className="relative">
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onCancel}
          className="fixed top-0 bottom-0 left-0 right-0 bg-gray-500/30 z-40 pointer-events-auto"
        ></div>
      )}
      <div className="fixed z-50 top-1/2 left-1/2 -translate-1/2 w-full max-w-[500px] p-4 bg-gray-50 rounded-2xl shadow">
        <Flex className="items-center justify-between border-b-2 border-gray-200">
          <Text size={4} className="py-4 font-semibold">
            Are you sure?
          </Text>
          <div className="p-1 border-[2px] border-rose-500 rounded-md">
            <IoMdClose className="text-rose-500" size={24} />
          </div>
        </Flex>
        <Text size={5} className="py-4">
          {confirmMessage}
        </Text>
        <Flex className="gap-2 justify-end">
          <button
            onClick={onCancel}
            className="text-rose-500 border border-rose-500 px-4 py-1"
          >
            Cancel
          </button>
          <button
            onClick={onSuccess}
            className="text-teal-500 border border-teal-500 px-4 py-1"
          >
            Confirm
          </button>
        </Flex>
      </div>
    </div>
  );
};

export default ConfirmModal;
