import React from "react";
import "./loading.css";
export default function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
      </div>
    </div>
  );
}
