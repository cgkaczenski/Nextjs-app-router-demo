"use client";

import { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { on } from "events";

export default function EditableCell(prop: {
  resetKey: number;
  saveKey: number;
  value: string;
  onEdit: (newValue: string) => void;
}) {
  const [originalValue, setOriginalValue] = useState(
    prop.value ? prop.value : ""
  );
  const { resetKey, saveKey, onEdit } = prop;
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [inputValue, setInputValue] = useState(originalValue);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnsavedChanges(true);
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    if (originalValue === inputValue) {
      setUnsavedChanges(false);
    }
    setIsEditing(false);
    onEdit(inputValue);
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
      type="text"
      className="border-2 border-gray-300"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus
    />
  ) : unsavedChanges ? (
    <div className="flex justify-between bg-yellow-100 group">
      <div className="justify-center text-sm text-gray-900">{inputValue}</div>
      <PencilSquareIcon
        onClick={() => handleEdit()}
        className="h-4 w-4 opacity-0 text-gray-300 cursor-pointer group-hover:opacity-100"
      />
    </div>
  ) : (
    <div className="flex justify-between group">
      <div className="justify-center text-sm text-gray-900">{inputValue}</div>
      <PencilSquareIcon
        onClick={() => handleEdit()}
        className="h-4 w-4 opacity-0  text-gray-300 cursor-pointer group-hover:opacity-100"
      />
    </div>
  );
}
