import { useEffect, useState } from "react";
import { getAuthCookie } from "../utils/cookie";

function useUser() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAuthCookie();
    if (token) {
      setIsLoggedIn(true);
    }
  })

	return { isLoggedIn };
}

export default useUser;
