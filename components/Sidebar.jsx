import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import AccountIcon from "../public/icons/account.svg";
import ProductsIcon from "../public/icons/products.svg";
import UpdatesIcon from "../public/icons/updates.svg";

const IconMap = {
  Account: AccountIcon,
  Products: ProductsIcon,
  Updates: UpdatesIcon,
};

function Sidebar({ links }) {
  const pathname = useRouter().pathname;
  const getSelectedItemId = () => {
    let arrayPath = pathname.split("/");
    if (arrayPath.length == 2) {
      return 0;
    } else {
      let activePath = links.filter((i) => i.href.includes(arrayPath[2]));
      activePath = activePath[0];
      return activePath.id;
    }
  };
  const [selectedItem, setSelectedItem] = useState(getSelectedItemId());

  useEffect(() => {
    setSelectedItem(getSelectedItemId());
  }, [pathname]);

  return (
    <>
      <div className="sticky left-0 flex min-h-screen  w-40 flex-col items-center rounded border-r-2 bg-white text-black">
        <div className="w-full px-2">
          <div className="flex w-full flex-col items-center">
            {links.map((item) => {
              const Icon = IconMap[item.label];
              return (
                <Link
                  href={`/my-account${item.href}`}
                  key={item.id}
                  className={`${
                    selectedItem == item.id ? "rounded bg-gray-300" : ""
                  } mt-2 flex h-12 w-full items-center rounded px-3 text-sm hover:bg-gray-300`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="ml-2 text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
