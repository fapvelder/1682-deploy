import React from "react";
import Contact from "../../../component/Contact";
import { Helmet } from "react-helmet-async";
import UserDetails from "../../../component/UserDetails";

export default function Chat() {
  return (
    <div className="pb-50">
      <div style={{ display: "flex", marginTop: 60 }}>
        <Helmet>
          <title>Messaging</title>
        </Helmet>
        <Contact />
      </div>
    </div>
  );
}
