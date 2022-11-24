import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import Layout from "components/layouts/Layout";
import Form from "components/ui/Form";

import { setAuthCookie } from "utils/cookie";
import extendedFetch from "utils/extendedFetch";

function SignIn() {
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

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const router = useRouter();

  const signIn = async ({ username, password }) => {
    const token = await extendedFetch({
      endpoint: "signin",
      method: "POST",
      body: { username, password },
      errors,
      setErrors,
      setLoading,
    });

    return token?.token;
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
      setErrors((errors) => [
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

    const token = await signIn({ username, password });
    if (token) {
      setAuthCookie(token);
      router.push("/");
    }
  };

  return (
    <section className="responsive-padding">
      <h2 className="text-4xl font-bold md:text-center">Sign In</h2>
      <Form
        className="mt-4 flex flex-col md:m-auto md:w-1/2"
        onHandleSubmit={onHandleSubmit}
        inputs={loginFormContent}
        buttonText={loading ? "Loading" : "Sign in"}
      />
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

SignIn.getLayout = function getLayout(page) {
  return (
    <Layout title="Sign In">
      <>{page}</>
    </Layout>
  );
};

export default SignIn;
