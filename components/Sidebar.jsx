import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Sidebar({links}) {
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
  }, [pathname])

  return (
    <aside className="responsive-padding flex w-52 h-screen flex-col gap-4 border-r-2 border-r-black">
      {links.map((item) => {
        return (
          <Link
            href={`/my-account${item.href}`}
            key={item.id}
            className={`${selectedItem == item.id ? "underline" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}

export default Sidebar;
