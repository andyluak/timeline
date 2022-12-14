import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";

import Modal from "components/ui/Modal";

import { getAuthCookie } from "utils/cookie";

import Cancel from "public/icons/cancel.svg";
import Pencil from "public/icons/pencil.svg";
import Save from "public/icons/save.svg";
import Trash from "public/icons/trash.svg";

function ProductListItem({ product: { name, id }, order }) {
  const queryClient = useQueryClient();

  const nameInputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const auth_token = getAuthCookie();

  const deleteMutation = useMutation({
    mutationFn: async (variables) => {
      const { id, auth_token } = variables;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/product/${id}`,
        {
          method: "DELETE",
          headers: {
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
      await queryClient.cancelQueries(["products"]);

      // get prev products
      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (oldProducts) =>
        oldProducts.filter((product) => product.id !== variables.id)
      );

      return { previousProducts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["products"], context.previousProducts);
    },
    onSettled: () => {
      setIsOpen(false);
      queryClient.invalidateQueries(["products"]);
    },
  });

  const editMutation = useMutation({
    mutationFn: async (variables) => {
      const { newName: name, auth_token, id } = variables;
      if (name.length === 0) {
        throw new Error();
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/product/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!res.ok) {
        const { errors } = await res.json();
        throw new Error(errors);
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["products"]);

      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (oldProducts) => {
        oldProducts.map((product) => {
          if (product.id == variables.id) {
            product.name = variables.name;
          }
          return product;
        });
      });

      return { previousProducts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["products"], context.previousProducts);
    },
    onSettled: () => {
      setIsEditing(false);
      setNewName("");
      queryClient.invalidateQueries(["products"]);
    },
  });

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <h3 className="tracking-body w-4/5 text-left text-xl leading-[18px] md:w-1/2  md:text-left">
        <span>{order}.</span>
        {isEditing ? (
          <input
            type="text"
            name="newName"
            id="newName"
            placeholder={name}
            className="tracking-body inline w-4/5 border-x-0 border-t-0 text-left text-xl leading-[18px] focus:outline-0  focus:ring-0 md:w-1/2 md:text-left"
            onChange={(e) => setNewName(e.target.value)}
            value={newName}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                editMutation.mutate({ id, auth_token, newName });
              }
            }}
            ref={nameInputRef}
          />
        ) : (
          <span>{name}</span>
        )}
      </h3>
      <div className="flex flex-row gap-4">
        {isEditing ? (
          <>
            <button
              className="flex h-16 cursor-pointer flex-col items-center fill-white transition-all hover:border-b-2 hover:border-b-gray-300"
              onClick={() => editMutation.mutate({ id, auth_token, newName })}
            >
              <Save />
              <p>Save</p>
            </button>
            <button
              className="flex h-16 cursor-pointer flex-col items-center fill-white transition-all hover:border-b-2 hover:border-b-gray-300"
              onClick={() => setIsEditing(false)}
            >
              <Cancel />
              <p>Cancel</p>
            </button>
          </>
        ) : (
          <>
            <button
              className="flex h-16 cursor-pointer flex-col items-center fill-white transition-all hover:border-b-2 hover:border-b-gray-300"
              onClick={() => {
                setIsEditing(!isEditing);
                setTimeout(() => nameInputRef.current.focus(), 100);
              }}
            >
              <Pencil />
              <p>Edit</p>
            </button>
            <button
              className="flex h-16 cursor-pointer flex-col items-center fill-white transition-all hover:border-b-2 hover:border-b-gray-300"
              onClick={openModal}
            >
              <Trash />
              <p>Remove</p>
            </button>
          </>
        )}
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} closeModal={closeModal}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-md font-medium leading-6 text-gray-900"
                >
                  Are you sure you want to delete {name} ?
                </Dialog.Title>
                <div className="mt-2 flex flex-row items-center justify-center gap-8">
                  <button
                    className="relative mt-2 border bg-black p-3 uppercase text-white transition-all hover:border hover:border-black hover:bg-white hover:text-black"
                    aria-label="Sign In"
                    type="submit"
                    onClick={() =>
                      deleteMutation.mutate({ id, auth_token, name })
                    }
                  >
                    {"Yes"}
                  </button>
                  <button
                    className="relative mt-2 border border-black bg-white p-3 uppercase text-black transition-all hover:border hover:border-black hover:bg-white hover:text-black"
                    aria-label="Sign In"
                    type="submit"
                    onClick={closeModal}
                  >
                    {"No"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductListItem;
