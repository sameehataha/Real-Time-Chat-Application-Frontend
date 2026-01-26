import { useEffect, useState } from "react";
import axios from "axios";

export const useAdminFetch = (url) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching admin data from:", url);

        const config = {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await axios.get(url, config);

        console.log("Admin data fetched successfully:", response.data);

        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", {
          status: err.response?.status,
          message: err.response?.data?.message,
          error: err.message,
        });

        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { loading, data, error };
};
