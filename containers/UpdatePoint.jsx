import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import { getAuthCookie } from "utils/cookie";

import Cancel from "public/icons/cancel.svg";
import Pencil from "public/icons/pencil.svg";
import Save from "public/icons/save.svg";
import Tool from "public/icons/tool.svg";
import Trash from "public/icons/trash.svg";

function UpdatePoint({ point, order }) {
  const queryClient = useQueryClient();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingType, setIsChangingType] = useState(false);

  const auth_token = getAuthCookie();

  const deleteMutation = useMutation({
    mutationFn: async (variables) => {
      const { id, auth_token } = variables;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/updatepoint/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`,
          },
        }
      );

      if (!res.ok) {
        const { errors } = await res.json();
        throw new Error(errors);
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["updatePoints", point.updateId]);

      const previousUpdate = queryClient.getQueryData([
        "updatePoints",
        point.updateId,
      ]);

      const newUpdate = {
        ...previousUpdate,
        updatePoints: previousUpdate.updatePoints.filter(
          (updatePoint) => updatePoint.id !== variables.id
        ),
      };

      queryClient.setQueryData(
        ["updatePoints", point.updateId],
        () => newUpdate
      );

      return { previousUpdate };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["updatePoints", point.updateId],
        context.previousUpdate
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["updatePoints", point.updateId]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (variables) => {
      const { id, auth_token, description, type } = variables;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/updatepoint/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`,
          },
          body: JSON.stringify({
            description: description !== "" ? description : point.description,
            type,
          }),
        }
      );

      if (!res.ok) {
        const { errors } = await res.json();
        throw new Error(errors);
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["updatePoints", point.updateId]);

      const previousUpdate = queryClient.getQueryData([
        "updatePoints",
        point.updateId,
      ]);

      const newUpdate = {
        ...previousUpdate,
        updatePoints: previousUpdate.updatePoints.map((updatePoint) => {
          if (updatePoint.id === variables.id) {
            return {
              ...updatePoint,
              description:
                variables.description !== ""
                  ? variables.description
                  : point.description,
              type: variables.type,
            };
          }
          return updatePoint;
        }),
      };

      queryClient.setQueryData(
        ["updatePoints", point.updateId],
        () => newUpdate
      );

      return { previousUpdate };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["updatePoints", point.updateId],
        context.previousUpdate
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["updatePoints", point.updateId]);
    },
  });

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { description, type } = Object.fromEntries(formData);

    updateMutation.mutate({ description, type, id: point.id, auth_token });
    setIsChangingType(false);
    setIsEditing(false);
  };

  const ChameleonComponent = () => {
    const values = [
      { id: "FEATURE", label: "Feature" },
      { id: "BUG_FIX", label: "Bug fix" },
      { id: "IMPROVEMENT", label: "Improvement" },
    ];
    if (isChangingType || isEditing) {
      return (
        <form onSubmit={onHandleSubmit}>
          {isEditing && (
            <textarea name={"description"} placeholder={point.description} />
          )}
          {isChangingType && (
            <select name={"type"}>
              {values.map(({ id, label }, i) => {
                return (
                  <option key={i} value={id} defaultValue={id === point.type}>
                    {label}
                  </option>
                );
              })}
            </select>
          )}
          <div className="mt-2 flex flex-row gap-2">
            <button className="flex h-12 cursor-pointer flex-col items-center fill-white text-sm transition-all hover:border-b-2 hover:border-b-gray-300">
              <Save className="w-5" />
              <p>Save</p>
            </button>
            <button
              className="flex h-12 cursor-pointer flex-col items-center fill-white text-sm transition-all hover:border-b-2 hover:border-b-gray-300"
              onClick={() => {
                setIsEditing(false);
                setIsChangingType(false);
              }}
            >
              <Cancel className="w-5" />
              <p>Cancel</p>
            </button>
          </div>
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
          {!isEditing && !isChangingType && (
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
              <button
                className="flex h-12 cursor-pointer flex-col items-center fill-white text-sm transition-all hover:border-b-2 hover:border-b-gray-300"
                onClick={() => {
                  deleteMutation.mutate({ id: point.id, auth_token });
                }}
              >
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
