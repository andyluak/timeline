import React from "react";

function Form({ onHandleSubmit, inputs, buttonText, className }) {
  return (
    <form className={className} onSubmit={onHandleSubmit}>
      {inputs.map(({ type, label, name, values }, i) => {
        switch (type) {
          case "text":
          case "password":
            return (
              <div className="mb-2 flex flex-col" key={i}>
                <label>{label}</label>
                <input type={type} name={name} autoComplete="off" />
              </div>
            );
          case "textarea":
            return (
              <div className="mb-2 flex flex-col" key={i}>
                <label>{label}</label>
                <textarea name={name} />
              </div>
            );

          case "select":
            return (
              <div className="mb-2 flex flex-col" key={i}>
                <label>{label}</label>
                <select name={name}>
                  {values.map(({ id, label }, i) => {
                    return (
                      <option key={i} value={id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
        }
      })}
      <button
        className="relative mt-2 border bg-black p-3 uppercase text-white transition-all hover:border hover:border-black hover:bg-white hover:text-black"
        aria-label={buttonText}
        type="submit"
      >
        {buttonText}
      </button>
    </form>
  );
}

export default Form;
