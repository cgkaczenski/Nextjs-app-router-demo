"use client";

import { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function EditableCell(props: {
  key: any;
  resetKey: number;
  saveKey: number;
  value: string;
  input_type: string;
  onEdit: (newValue: string) => void;
}) {
  const [originalValue, setOriginalValue] = useState(
    props.value ? props.value : ""
  );
  const { resetKey, saveKey, input_type, onEdit } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [inputValue, setInputValue] = useState(originalValue);
  const [isValid, setIsValid] = useState(true);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnsavedChanges(true);
    setInputValue(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (originalValue === inputValue) {
      setUnsavedChanges(false);
    }
    setIsEditing(false);
    if (e.target.checkValidity()) {
      onEdit(inputValue);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    setInputValue(originalValue);
    setUnsavedChanges(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    setOriginalValue(inputValue);
    setUnsavedChanges(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveKey]);

  return isEditing ? (
    <input
      type={input_type}
      className="border-2 border-gray-300"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus
    />
  ) : unsavedChanges ? (
    <div>
      <div
        className={`flex justify-between group ${
          isValid ? "bg-yellow-100" : "bg-red-100 border border-red-500"
        }`}
      >
        <div className="justify-center text-sm text-gray-900">{inputValue}</div>
        <PencilSquareIcon
          onClick={() => handleEdit()}
          className="h-4 w-4 opacity-0 text-gray-300 cursor-pointer group-hover:opacity-100"
        />
      </div>
      <div>
        {!isValid && <p className="text-red-500 text-sm">Invalid Input</p>}
      </div>
    </div>
  ) : (
    <div key={props.key} className="flex justify-between group">
      <div className="justify-center text-sm text-gray-900">{inputValue}</div>
      <PencilSquareIcon
        onClick={() => handleEdit()}
        className="h-4 w-4 opacity-0  text-gray-300 cursor-pointer group-hover:opacity-100"
      />
    </div>
  );
}
