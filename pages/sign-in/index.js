import Link from "next/link";
import React from "react";

function SignIn() {
  const loginFormContent = [
    {
      label: "Email",
      type: "email",
      name: "email",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
    },
  ];

  return (
    <section className="responsive-padding">
      <h2 className="text-4xl font-bold md:text-center">Sign In</h2>
      <form className="mt-4 flex flex-col md:m-auto md:w-1/2">
        {loginFormContent.map((f, i) => {
          return (
            <div className="mb-2 flex flex-col" key={i}>
              <label>{f.label}</label>
              <input type={f.type} name={f.name} />
            </div>
          );
        })}
        <button
          className="relative mt-2 border bg-black p-3 uppercase text-white transition-all hover:border hover:border-black hover:bg-white hover:text-black"
          aria-label="Sign In"
        >
          Sign In
        </button>
      </form>
      <p className="mt-8 md:text-center">
        Don't have an account yet?{" "}
        <Link href="/register">
          <button
            className="relative mt-2 border bg-black p-3 uppercase text-white transition-all hover:border hover:border-black hover:bg-white hover:text-black"
            aria-label="Sign In"
          >
            Register now !
          </button>
        </Link>
      </p>
    </section>
  );
}

export default SignIn;
