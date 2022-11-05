import content from "content.json";
import React, { useState } from "react";

import Layout from "components/layouts/Layout";
import MyAccountDesktop from "components/layouts/MyAccountDesktop";
import MyAccountMobile from "components/layouts/MyAccountMobile";

import useDeviceSize from "hooks/useDeviceSize";

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
    <section className="responsive-padding flex w-full flex-col justify-start">
      <h1 className="tracking-header text-center text-4xl font-bold md:text-left">
        Account Details
      </h1>
      <form
        className="m-auto mt-4 flex w-3/4 flex-col md:m-0 md:w-1/2"
        onSubmit={onHandleSubmit}
      >
        {changePasswordContent.map((f, i) => {
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
          type="submit"
        >
          {loading ? "Loading" : "Save changes"}
        </button>
      </form>
      {errors.map((e, i) => {
        return (
          <p key={i} className="mt-4 text-center text-red-500">
            {e}
          </p>
        );
      })}
    </section>
  );
}

export const getServerSideProps = async () => {
  const menuLinks = content.menuLinks;

  return {
    props: { menuLinks },
  };
};

MyAccount.getLayout = function getLayout(page) {
  const {
    props: { menuLinks },
  } = page;
  const { isMobile } = useDeviceSize();
  const LayoutComponent = isMobile ? MyAccountMobile : MyAccountDesktop;

  return (
    <>
      <Layout title="My Account">
        <LayoutComponent links={menuLinks}>{page}</LayoutComponent>
      </Layout>
    </>
  );
};

export default MyAccount;
