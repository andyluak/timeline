const extendedFetch = async ({
  endpoint,
  method,
  body,
  errors,
  setErrors,
  setLoading,
  token,
}) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  setLoading(true);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${endpoint}`, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    if (res.status > 300) {
      const newErrors = new Set(errors);
      if (res.status === 401) {
        newErrors.add("You are not authorized");
      }

      if (res.status === 403) {
        newErrors.add("You are not authorized");
      }

      if (res.status === 404) {
        newErrors.add("The resource you are looking for does not exist");
      }

      if (res.status === 500) {
        newErrors.add("Something went wrong");
      }
      setErrors(Array.from(newErrors));
      setLoading(false);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    setErrors(["Something went wrong"]);
    setLoading(false);
    return;
  }
};

export default extendedFetch;
