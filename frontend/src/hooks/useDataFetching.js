import { useEffect, useState } from "react";

function useDataFetching() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          users: 1500,
          revenue: 250000,
          orders: 320,
        },
      ]);
    }, 1000);
  }, []);

  return data;
}

export default useDataFetching;