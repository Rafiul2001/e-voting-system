import { IoMdClose } from "react-icons/io";
import Flex from "../../ui/Flex";
import Text from "../../ui/Text";
import { useCallback, useEffect, useState } from "react";
import type { TAddConstituencyForCandidate } from "../../../types/candidateType";
import { useConstituencyStore } from "../../../store/constituencyStore";

type TDynamicFormModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  onSuccess: (data: TAddConstituencyForCandidate) => Promise<void>;
};

const DEFAULT_VALUES: TAddConstituencyForCandidate = {
  constituencyNumber: 0,
  constituencyName: "",
  candidateId: "",
  electionId: "",
};

const AddConstituencyToCandidateModal: React.FC<TDynamicFormModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  onSuccess,
}) => {
  const [formData, setFormData] =
    useState<TAddConstituencyForCandidate>(DEFAULT_VALUES);
  const [inputError, setInputError] = useState<Record<string, string>>({});
  const { divisionList } = useConstituencyStore();
  const [filter, setFilter] = useState<{
    divisionName: string;
    districtName: string;
    constituencyName: string;
    constituencyNumber: number;
  }>({
    districtName: "",
    divisionName: "",
    constituencyName: "",
    constituencyNumber: 0,
  });

  const selectedDivision = divisionList.find(
    (d) => d.divisionName === filter.divisionName
  );

  const selectedDistrict = selectedDivision?.districts.find(
    (dist) => dist.districtName === filter.districtName
  );

  const onChangeFormData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
    setInputError((prev) => ({ ...prev, [e.target.name]: "" })); // clear error on change
  };

  const onFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilter((state) => ({ ...state, [e.target.name]: e.target.value }));
    setInputError((prev) => ({ ...prev, [e.target.name]: "" })); // clear error on change
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const errors: Record<string, string> = {};

      // Election ID
      if (!formData.electionId.trim()) {
        errors.electionId = "Election ID is required.";
      }

      // Division Name
      if (!filter.divisionName.trim()) {
        errors.divisionName = "Division Name is required";
      }

      // District Name
      if (!filter.districtName.trim()) {
        errors.districtName = "District Name is required";
      }

      // Constituency Number
      if (!formData.constituencyNumber) {
        errors.constituencyNumber = "Constituency number is required.";
      } else if (
        isNaN(Number(formData.constituencyNumber)) ||
        Number(formData.constituencyNumber) <= 0
      ) {
        errors.constituencyNumber =
          "Constituency number must be a positive number.";
      }

      // Constituency Name
      if (!formData.constituencyName.trim()) {
        errors.constituencyName = "Constituency name is required.";
      }

      // Show errors if any exist
      if (Object.keys(errors).length > 0) {
        setInputError(errors);
        return;
      }

      // Otherwise, submit form successfully
      await onSuccess(formData);
      setIsOpen(false);
    },
    [filter.districtName, filter.divisionName, formData, onSuccess, setIsOpen]
  );

  useEffect(() => {
    if (!isOpen) {
      setFormData(DEFAULT_VALUES);
      setInputError({});
    }
  }, [isOpen]);

  return (
    <div className="relative ">
      {/* Overlay */}
      <div
        onClick={handleCancel}
        className={`fixed inset-0 bg-gray-500/30 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Modal */}
      <div
        className={`fixed z-50 top-1/2 left-1/2 w-full max-w-[500px] max-h-full overflow-auto p-4 bg-gray-50 rounded-2xl shadow transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            : "opacity-0 scale-95 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        }`}
      >
        <Flex className="items-center justify-between border-b-2 border-gray-200">
          <Text size={4} className="py-4 font-semibold">
            {title}
          </Text>
          <div
            onClick={handleCancel}
            className="p-1 text-white bg-rose-500 cursor-pointer hover:bg-rose-600 rounded-md transition-all"
          >
            <IoMdClose size={24} />
          </div>
        </Flex>

        {/* Dynamic Form */}
        <form
          onSubmit={handleSubmit}
          className="py-2 flex flex-col gap-4 h-fit overflow-auto"
        >
          {/* Division */}
          <Flex className="flex-col gap-2">
            <label>Division</label>
            <select
              name="divisionName"
              value={filter.divisionName}
              onChange={onFilterChange}
              className={`border-[2px] ${
                inputError.divisionName ? "border-red-500" : "border-indigo-300"
              } px-2 py-1 rounded-md`}
            >
              <option value="">Select Division</option>
              {divisionList.map((d) => (
                <option key={d.divisionName} value={d.divisionName}>
                  {d.divisionName}
                </option>
              ))}
            </select>
          </Flex>

          {/* District Name */}
          {selectedDivision && (
            <Flex className="flex-col gap-2">
              <label>District Name</label>
              <select
                name="districtName"
                value={filter.districtName}
                onChange={onFilterChange}
                className={`border-[2px] ${
                  inputError.districtName
                    ? "border-red-500"
                    : "border-indigo-300"
                } px-2 py-1 rounded-md`}
              >
                <option value="">Select District</option>
                {selectedDivision.districts.map((dist) => (
                  <option key={dist.districtName} value={dist.districtName}>
                    {dist.districtName}
                  </option>
                ))}
              </select>
            </Flex>
          )}

          {/* Constituency */}
          {selectedDistrict && (
            <Flex className="flex-col gap-2">
              <label>Constituency Number</label>
              <select
                name="constituencyNumber"
                value={formData.constituencyNumber}
                onChange={onChangeFormData}
                className={`border-[2px] ${
                  inputError.constituencyNumber
                    ? "border-red-500"
                    : "border-indigo-300"
                } px-2 py-1 rounded-md`}
              >
                <option value="">Select Constituency Number</option>
                {selectedDistrict.constituencies.map((c) => (
                  <option
                    key={c.constituencyNumber}
                    value={c.constituencyNumber}
                  >
                    {c.constituencyNumber}
                  </option>
                ))}
              </select>
            </Flex>
          )}

          {/* Constituency Name */}
          {selectedDistrict && (
            <Flex className="flex-col gap-2">
              <label htmlFor="constituencyName">
                <Text size={5} className="font-semibold">
                  Constituency Name
                </Text>
              </label>
              <select
                name="constituencyName"
                id="constituencyName"
                value={formData.constituencyName}
                onChange={onChangeFormData}
                className="border-[2px] border-indigo-300 focus:outline-indigo-500 px-2 py-1 rounded-md focus:text-indigo-700 font-medium"
              >
                <option value="">Select Constituency Name</option>
                {selectedDistrict.constituencies.map((c) => (
                  <option key={c.constituencyName} value={c.constituencyName}>
                    {c.constituencyName}
                  </option>
                ))}
              </select>
              {inputError["constituencyName"] && (
                <Text className="text-rose-400 font-medium">
                  {inputError["constituencyName"]}
                </Text>
              )}
            </Flex>
          )}

          {/* Buttons */}
          <Flex className="gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="text-white px-4 py-1 bg-rose-500 hover:bg-rose-600 cursor-pointer rounded-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white px-4 py-1 bg-teal-500 hover:bg-teal-600 cursor-pointer rounded-sm transition-all"
            >
              Submit
            </button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddConstituencyToCandidateModal;
