import { Grid } from "@material-ui/core";
import { useEffect, useReducer, useState } from "react";

import { Button, Form, Input, Modal, Space, Table } from "antd";
import { toast } from "react-toastify";
import React from "react";
import { Link } from "react-router-dom";
import { Select } from "antd";
import { useContext } from "react";
import {
  deleteUser,
  fetchRoles,
  fetchUsers,
  updateUser,
} from "../../../api/index.js";
import "./User.css";
import { getError } from "../../../utils";
import useLoading from "../../../component/HandleLoading/useLoading.js";
import handleLoading from "../../../component/HandleLoading/index.js";
import Loading from "../../../component/Loading/index.js";
const { Option } = Select;
const User = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const { loading, setLoading, reload, setReload } = useLoading();
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await fetchUsers();
        setUsers(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchAllUsers();
  }, [reload]);
  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const { data } = await fetchRoles();
        setRoles(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchAllRoles();
  }, [reload]);

  const [roleID, setRoleID] = useState("");
  const updateUserHandler = async (record) => {
    if (window.confirm("Are you sure to update this user?")) {
      handleLoading(
        async () => {
          await updateUser(record.key, roleID);
        },
        setLoading,
        setReload,
        "User updated successfully"
      );
    }
  };
  const deleteUserHandler = async (record) => {
    if (window.confirm("Are you sure to delete this user?")) {
      const userID = record.key;
      handleLoading(
        async () => {
          await deleteUser(userID);
        },
        setLoading,
        setReload,
        "User deleted successfully"
      );
    }
  };

  const data = users?.map((user) => ({
    key: user._id,
    fullName: user?.fullName,
    email: user?.email,
    role: user?.role?.roleName,
  }));
  const components = {
    header: {
      wrapper: "thead",
      row: "tr",
      cell: "th",
    },
  };
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      width: "30%",
      className: "customerThead",
      render: (text) => text,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "20%",
      render: (_, record) => (
        <Select
          size="large"
          defaultValue={record.role}
          style={{ width: "100%" }}
          onChange={(event) => {
            setRoleID(event);
          }}
        >
          {roles?.map((role) => (
            <Option key={role._id} value={role._id}>
              {role.roleName}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "20%",

      render: (_, record) => (
        <Space size="middle">
          <Link
            className="tableButton"
            onClick={() => updateUserHandler(record)}
          >
            Update{" "}
          </Link>
          <Link
            className="tableButton"
            onClick={() => deleteUserHandler(record)}
          >
            Delete
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Grid container alignItems="stretch" className="mg-auto-80">
      {loading && <Loading />}
      <Grid item xs={12} sm={12}>
        <Table
          className="customTable"
          components={components}
          columns={columns}
          dataSource={data}
        />
      </Grid>
    </Grid>
  );
};
export default User;
