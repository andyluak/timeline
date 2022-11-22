export async function getProducts(auth_token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/product`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
  });
  const data = await res.json();
  return data;
}
