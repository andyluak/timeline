import Image from "next/image";
import React from "react";

function Button({ isPrimary, icon, text, ...props }) {
  return (
    <button
      className="relative mt-2 flex w-64 flex-row items-center justify-around border bg-black fill-white p-3 uppercase text-white transition-all hover:border hover:border-black hover:bg-white hover:fill-black hover:text-black md:m-0 md:mt-2"
      {...props}
    >
      {text}
      {icon && <i>{icon}</i>}
    </button>
  );
}

export default Button;
