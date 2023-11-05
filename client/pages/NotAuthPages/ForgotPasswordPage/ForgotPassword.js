import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "@material-ui/core";
import { Button, Divider, Input } from "antd";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Icon, { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getError } from "../../../utils";
import { forgotPassword } from "../../../api";
import handleLoading from "../../../component/HandleLoading";
import useLoading from "../../../component/HandleLoading/useLoading";
import Loading from "../../../component/Loading";
function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { loading, setLoading, setReload } = useLoading();
  const handleSubmit = async (event) => {
    event.preventDefault();
    handleLoading(
      async () => {
        await forgotPassword(email);
      },
      setLoading,
      setReload,
      `Email has been sent to ${email}. Please check it`
    );
  };
  return (
    <Grid container className="mg-auto-80">
      {loading && <Loading />}
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <Grid
        container
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={4}
          className="border"
          style={{ padding: 20 }}
        >
          <div className="forgot-password-not-signedin">
            <center className="item">
              <img
                style={{
                  width: 128,
                  height: 128,
                  marginBottom: 15,
                  marginTop: 50,
                }}
                src="https://cdn-icons-png.flaticon.com/512/625/625086.png"
                alt="lock"
              />
              <p style={{ marginBottom: 15 }}>Trouble logging in?</p>
              <span style={{ fontSize: 16, marginBottom: 15 }}>
                Enter your email and we'll send you a link to get back into your
                account.
              </span>
              <Input
                type="email"
                id="email"
                placeholder="Input your email"
                style={{ width: "80%", marginBottom: 15 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="primary"
                style={{ width: "80%", marginBottom: 15 }}
                onClick={(e) => handleSubmit(e)}
              >
                Reset Password
              </Button>
              <Divider>OR</Divider>
              <Button
                style={{ width: "80%", marginBottom: 15 }}
                onClick={() => navigate("/login")}
              >
                Back to login
              </Button>
            </center>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ForgotPassword;
