import React, { useState } from "react";

import TimerWrapper from "components/TimerWrapper";
import Layout from "components/layouts/Layout";
import MyAccountLayout from "components/layouts/MyAccountLayout";
import Form from "components/ui/Form";

import { getAuthCookie } from "utils/cookie";

function MyAccount() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const changePasswordContent = [
    {
      label: "Current Password",
      type: "password",
      name: "currentPassword",
    },
    {
      label: "New Password",
      type: "password",
      name: "newPassword",
    },
    {
      label: "Confirm Password",
      type: "password",
      name: "confirmPassword",
    },
  ];

  const changePassword = async ({ newPassword, token, currentPassword }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/user`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: newPassword,
        currentPassword,
      }),
    });

    if (res.status > 300) {
      const error = await res.json();
      setErrors(["You entered an invalid password !"]);
    }

    setLoading(false);
    return;
  };

  const onHandleSubmit = async (e) => {
    setErrors([]);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { currentPassword, newPassword, confirmPassword } =
      Object.fromEntries(formData);

    const validatePassword = (password) => {
      const minLength = password.length >= 8;
      const hasNumber = /\d/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);

      return minLength && hasNumber && hasUpperCase && hasLowerCase;
    };

    if (newPassword !== confirmPassword && !validatePassword(newPassword)) {
      setErrors((errors) => [
        ...errors,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      ]);

      return;
    }

    const token = getAuthCookie();
    setLoading(true);
    await changePassword({ newPassword, currentPassword, token });
    e.target.reset();
    return;
  };
  return (
    <TimerWrapper>
      <section className="responsive-padding flex w-full flex-col justify-start">
        <h1 className="tracking-header text-center text-4xl font-bold md:text-left">
          Account Details
        </h1>
        <Form
          className="m-auto mt-4 flex w-3/4 flex-col md:m-0 md:w-1/2"
          onHandleSubmit={onHandleSubmit}
          inputs={changePasswordContent}
          buttonText={loading ? "Loading" : "Save Changes"}
        />
        {errors.map((e, i) => {
          return (
            <p key={i} className="mt-4 text-center text-red-500 md:text-left">
              {e}
            </p>
          );
        })}
      </section>
    </TimerWrapper>
  );
}

MyAccount.getLayout = function getLayout(page) {
  return (
    <>
      <Layout title="My Account">
        <MyAccountLayout>{page}</MyAccountLayout>
      </Layout>
    </>
  );
};

export default MyAccount;
