import { Button, Divider, Form, Input } from "antd";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, Link } from "react-router-dom";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getError } from "../../../utils";
import jwtDecode from "jwt-decode";
import { Store } from "../../../Store";
import { registerGoogleUser, registerUser } from "../../../api";
import "./register.css";
const Register = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const { dispatch: ctxDispatch } = useContext(Store);

  const submitHandler = async () => {
    if (password !== rePassword) {
      toast.error("Password do not match");
      return;
    }
    try {
      const { data } = await registerUser(fullName, email, password);
      ctxDispatch({ type: "USER_LOGIN", payload: data });
      localStorage.setItem("token", data.token);
      navigate(redirect || "/");
      navigate(0);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCallbackResponse = useCallback(
    async (response) => {
      let user = jwtDecode(response.credential);
      let email = user.email;
      let isVerified = user.email_verified;
      let fullName = user.name;
      let avatar = user.picture;
      let password = email + fullName;
      if (isVerified) {
        try {
          const { data } = await registerGoogleUser(
            fullName,
            email,
            avatar,
            password
          );
          ctxDispatch({ type: "USER_LOGIN", payload: data });
          localStorage.setItem("token", data.token);
          navigate(redirect || "/");
          navigate(0);
        } catch (err) {
          toast.error(getError(err));
        }
      } else {
        toast.error("Your email is not verified");
      }
    },
    [ctxDispatch, navigate, redirect]
  );
  useEffect(() => {
    const googleService = () => {
      window?.google?.accounts?.id?.initialize({
        client_id:
          "524537065604-pfst28oopm5kq31je7u6qtjcb22td9h6.apps.googleusercontent.com",
        callback: handleCallbackResponse,
        context: "signup",
      });
      const parent = document.getElementById("registerDiv");
      window?.google?.accounts?.id?.renderButton(parent, {
        type: "standard",
        width: 400,
        text: "signup_with",
        locale: "en-US",
      });
      window?.google?.accounts?.id?.prompt();
    };
    setTimeout(googleService, 100);
  }, [handleCallbackResponse]);

  return (
    <div className="register">
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 400,
        }}
        autoComplete="off"
        onFinish={(e) => submitHandler(e)}
        onFinishFailed={onFinishFailed}
      >
        <Helmet>
          <title>Register</title>
        </Helmet>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Fullname"
          name="fullname"
          rules={[
            {
              required: true,
              message: "Please input your fullname!",
            },
          ]}
        >
          <Input onChange={(e) => setFullName(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Re-Password"
          name="rePassword"
          rules={[
            {
              required: true,
              message: "Please input your re-password!",
            },
          ]}
        >
          <Input.Password onChange={(e) => setRePassword(e.target.value)} />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" htmlType="submit" style={{ width: "100px" }}>
            Register
          </Button>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 0,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Already have an account?</p>
            <p>
              <Link to="/login">
                <Button>Go to Login</Button>
              </Link>
            </p>
          </div>
        </Form.Item>
        <Divider>Or register by Google</Divider>
        <div id="registerDiv"></div>
        <div id="loginDiv"></div>
      </Form>
    </div>
  );
};
export default Register;
