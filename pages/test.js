import { useEffect } from "react";

const test = () => {
  const getCatalog = async () => {
    const result = await fetch("/api/catalog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.ok) {
      return result.json();
    }
  };

  useEffect(() => {
    getCatalog().then((res) => console.log(res));
  }, []);
  return <div>Enter</div>;
};

export default test;
