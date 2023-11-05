import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import { getError } from "../../utils";
export default function UserRoute({ children }) {
  const { state } = useContext(Store);
  const [navigate, setNavigate] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setNavigate(children);
        } else {
          setNavigate(<Navigate to="/login" />);
        }
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchUser();
  }, [children, state.data]);
  return navigate;
}
