import { useRouter } from "next/router";
import { useState } from "react";

import Layout from "components/layouts/Layout";
import Form from "components/ui/Form";

import { setAuthCookie } from "utils/cookie";
import extendedFetch from "utils/extendedFetch";

function Register() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const registerFormContent = [
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
    {
      label: "Confirm Password",
      type: "password",
      name: "confirmPassword",
    },
  ];

  const register = async ({ username, password }) => {
    const res = await extendedFetch({
      endpoint: "user",
      method: "POST",
      body: { username, password },
      errors,
      setErrors,
      setLoading,
    });

    return res?.token;
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

    const token = await register({ username, password });

    if (token) {
      setAuthCookie(token);
      router.push("/");
    }
  };
  return (
    <section className="responsive-padding">
      <h2 className="text-4xl font-bold md:text-center">Register</h2>
      <Form
        className="mt-4 flex flex-col md:m-auto md:w-1/2"
        onHandleSubmit={onHandleSubmit}
        inputs={registerFormContent}
        buttonText={loading ? "Loading" : "Register"}
      />
      {errors.map((e, i) => {
        return (
          <p key={i} className="mt-4 text-red-500 md:text-center">
            {e}
          </p>
        );
      })}
    </section>
  );
}

Register.getLayout = function getLayout(page) {
  return <Layout title="Register">{page}</Layout>;
};

export default Register;
