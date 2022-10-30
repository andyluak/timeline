import React from "react";

function Register() {
	const registerFormContent = [
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
		{
			label: "Confirm Password",
			type: "password",
			name: "confirmPassword",
		},
	];
	return (
		<section className="responsive-padding">
			<h2 className="text-4xl font-bold md:text-center">Register</h2>
			<form className="mt-4 flex flex-col md:m-auto md:w-1/2">
				{registerFormContent.map((f, i) => {
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
					Register
				</button>
			</form>
		</section>
	);
}

export default Register;
