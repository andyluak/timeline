import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { setAuthCookie } from "../../utils/cookie";

function SignIn() {
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const loginFormContent = [
    {
      label: "Username",
      type: "text",
      name: "username",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
    },
  ];

  const signIn = async ({ username, password }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (res.status > 300) {
      const error = await res.json();
      setErrors([error.message]);
      return;
    }

    const token = await res.json();
    return token;
  };

  const onHandleSubmit = async (e) => {
    setErrors([]);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, password } = Object.fromEntries(formData);

    const validatePassword = (password) => {
      const minLength = password.length >= 8;
      const hasNumber = /\d/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);

      return minLength && hasNumber && hasUpperCase && hasLowerCase;
    };

    const validateUsername = (username) => {
      const hasSymbols = /[^a-zA-Z0-9]/.test(username);
      const hasWhiteSpace = /\s/.test(username);
      const hasUpperCase = /[A-Z]/.test(username);

      return !hasSymbols && !hasWhiteSpace && !hasUpperCase;
    };

    if (!validateUsername(username)) {
      setErrors([
        ...errors,
        "Username must be lowercase and contain no symbols or spaces",
      ]);
      return;
    }

    if (!validatePassword(password)) {
      // Add the error to existing error array
      setErrors((errors) => [
        ...errors,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      ]);

      return;
    }

    const { token } = await signIn({ username, password });

    if (token) {
      setAuthCookie(token);
      router.push("/");
    }
  };

  return (
    <section className="responsive-padding">
      <h2 className="text-4xl font-bold md:text-center">Sign In</h2>
      <form
        className="mt-4 flex flex-col md:m-auto md:w-1/2"
        onSubmit={onHandleSubmit}
      >
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
      {errors.map((e, i) => {
        return (
          <p key={i} className="mt-4 text-red-500 md:text-center">
            {e}
          </p>
        );
      })}
      <p className="mt-8 md:text-center">
        {"Don't have an account yet? "}
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
