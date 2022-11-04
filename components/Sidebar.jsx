import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    <aside className="responsive-padding flex h-screen w-52 flex-col gap-4 border-r-2 border-r-black md:w-96">
      {links.map((item) => {
        return (
          <Link
            href={`/my-account${item.href}`}
            key={item.id}
            className={`${selectedItem == item.id ? "underline" : ""} w-full`}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}

export default Sidebar;
