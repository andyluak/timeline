import React, { useState } from "react";
import Pencil from "public/icons/pencil.svg";
import Trash from "public/icons/trash.svg";
import Tool from "public/icons/tool.svg";
import Save from "public/icons/save.svg";
import Cancel from "public/icons/cancel.svg";

function UpdatePoint({ point, order }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingType, setIsChangingType] = useState(false);

  const ChameleonComponent = () => {
    const values = [
      { id: "FEATURE", label: "Feature" },
      { id: "BUG_FIX", label: "Bug fix" },
      { id: "IMPROVEMENT", label: "Improvement" },
    ];
    if (isChangingType || isEditing) {
      return (
        <form>
          {isEditing && (
            <textarea name={"description"} placeholder={point.description} />
          )}
          {isChangingType && (
            <select name={"type"}>
              {values.map(({ id, label }, i) => {
                return (
                  <option key={i} value={id}>
                    {label}
                  </option>
                );
              })}
            </select>
          )}
        </form>
      );
    }

    return (
      <li
        className="w-fit cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >{`${order + 1}.${point.description}`}</li>
    );
  };
  return (
    <div className="flex w-fit flex-col gap-2">
      <ChameleonComponent />
      {isMenuOpen && (
        <div className="my-2 flex flex-row items-center justify-start gap-4">
          {isEditing || isChangingType ? (
            <>
              <button
                className="flex h-12 cursor-pointer flex-col items-center fill-white text-sm transition-all hover:border-b-2 hover:border-b-gray-300"
              >
                <Save className="w-5" />
                <p>Save</p>
              </button>
              <button
                className="flex h-12 cursor-pointer flex-col items-center fill-white text-sm transition-all hover:border-b-2 hover:border-b-gray-300" onClick={() => {
                  setIsEditing(false);
                  setIsChangingType(false);
                }}
              >
                <Cancel className="w-5"/>
                <p>Cancel</p>
              </button>
            </>
          ) : (
            <>
              <button
                className="flex h-12 cursor-pointer flex-col items-center fill-white text-sm transition-all hover:border-b-2 hover:border-b-gray-300"
                onClick={() => setIsChangingType(!isChangingType)}
              >
                <Tool className="w-5" />
                <p>Change Type</p>
              </button>
              <button
                className="flex h-12 cursor-pointer flex-col items-center fill-white text-sm transition-all hover:border-b-2 hover:border-b-gray-300"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Pencil className="w-5" />
                <p>Edit</p>
              </button>
              <button className="flex h-12 cursor-pointer flex-col items-center fill-white text-sm transition-all hover:border-b-2 hover:border-b-gray-300">
                <Trash className="w-5" />
                <p>Remove</p>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default UpdatePoint;
