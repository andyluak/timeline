import { useState } from "react";
import { getAuthCookie } from "../utils/cookie";

const useFetch = (route, method, body) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = getAuthCookie();
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/${route}`, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body }),
      });
      const json = await res.json();
      setResponse(json);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  return { response, error, loading, fetchData };
};

export default useFetch;