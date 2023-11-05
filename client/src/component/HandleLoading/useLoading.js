import { useState } from "react";

const useLoading = () => {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  return { loading, setLoading, reload, setReload };
};

export default useLoading;
