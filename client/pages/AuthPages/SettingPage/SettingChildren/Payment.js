import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import "./payment.css";
import { Input, Modal } from "antd";
export default function Payment() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const modalContainer = document.getElementById("modal-container");
  return (
    <Grid container>
      <h4>Payment Methods</h4>
      <Grid container></Grid>
      <h4>Addresses</h4>
      <Grid container>
        <div className="addNewAddress text-start" onClick={showModal}>
          <p className="ml-15"> &gt; Add new address</p>
        </div>
      </Grid>

      <Modal
        title="Add New Address"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={() => modalContainer}
      >
        <div className="inputContainer">
          <Input className="inputModal" placeholder="Full Name" />
        </div>
        <div className="inputContainer">
          <Input className="inputModal" placeholder="Street Address 1" />
        </div>
        <div className="inputContainer">
          <Input className="inputModal" placeholder="Street Address 2" />
        </div>
        <div className="inputContainer">
          <Input className="inputModal" placeholder="City" />
        </div>
        <div className="inputContainer">
          <Input className="inputModal" placeholder="Zip or Postal Code" />
        </div>
        <div className="inputContainer">
          <Input className="inputModal" placeholder="Zip or Postal Code" />
        </div>
        <div className="inputContainer">
          <Input className="inputModal" placeholder="State or Province" />
        </div>
        <div className="inputContainer">
          <Input className="inputModal" placeholder="Country" />
        </div>
      </Modal>
    </Grid>
  );
}
