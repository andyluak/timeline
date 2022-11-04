import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const data = [
  { id: 0, label: "My Account", href: "/" },
  { id: 1, label: "My Products", href: "/products" },
];

const Dropdown = () => {
  const pathname = useRouter().pathname;
  const getSelectedItemId = () => {
    let arrayPath = pathname.split("/");
    if (arrayPath.length == 2) {
      return 0;
    } else {
      let activePath = data.filter((i) => i.href.includes(arrayPath[2]));
      activePath = activePath[0];
      return activePath.id;
    }
  };

  const [isOpen, setOpen] = useState(false);
  const [items, _] = useState(data);
  const [selectedItem, setSelectedItem] = useState(getSelectedItemId());

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (id) => {
    setSelectedItem(id);
    setOpen(false);
  };

  return (
    <div className="m-auto w-[300px] border border-slate-400 bg-white shadow-md">
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={toggleDropdown}
      >
        {selectedItem !== null
          ? items.find((item) => item.id == selectedItem).label
          : "Select your destination"}
        <i>
          <Image
            src="/icons/down_arrow.svg"
            width={20}
            height={20}
            className={`transition-all ${isOpen && "rotate-180"}`}
            alt=""
          />
        </i>
      </div>
      <div
        className={`border-t border-t-slate-300 p-4 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {items
          .filter((item) => item.id != selectedItem)
          .map((item, i) => (
            <Link href={`/my-account${item.href}`} key={i}>
              <div
                className="p-4 hover:cursor-pointer hover:underline"
                onClick={(e) => handleItemClick(e.target.id)}
                id={item.id}
              >
                {item.label}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Dropdown;
