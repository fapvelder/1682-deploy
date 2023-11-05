import { Grid } from "@material-ui/core";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Modal, Space, Table } from "antd";
import { toast } from "react-toastify";
import React from "react";
import { Link } from "react-router-dom";
import { Select } from "antd";
import { createRole, deleteRole, fetchRoles } from "../../../api";
import { getError } from "../../../utils";
import useLoading from "../../../component/HandleLoading/useLoading";
import handleLoading from "../../../component/HandleLoading";
import Loading from "../../../component/Loading";
const Role = () => {
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const { loading, setLoading, reload, setReload } = useLoading();
  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const result = await fetchRoles();
        setRoles(result.data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchAllRoles();
  }, [reload]);
  const data = roles?.map((role) => ({
    key: role?._id,
    role: role?.roleName,
  }));
  const columns = [
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "90%",
      render: (text) => text,
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <Link
            className="tableButton"
            onClick={() => deleteRoleHandler(record)}
          >
            Delete
          </Link>
        </Space>
      ),
    },
  ];

  const deleteRoleHandler = async (record) => {
    if (window.confirm("Are you sure to delete this role?")) {
      const id = record.key;
      handleLoading(
        async () => {
          await deleteRole(id);
        },
        setLoading,
        setReload,
        "Role deleted successfully"
      );
    }
  };

  const onSubmit = async () => {
    handleLoading(
      async () => {
        await createRole(role);
      },
      setLoading,
      setReload,
      "Role created successfully"
    );
    handleClose();
  };
  const [ModalOpen, setModalOpen] = useState(false);
  const handleClose = React.useCallback(() => {
    setModalOpen(false);
    setRole("");
  }, []);
  const viewModal = React.useCallback(() => {
    setModalOpen(true);
  }, []);
  const checkToRole = () => {
    return role === "";
  };
  return (
    <Grid container alignItems="stretch" className="mg-auto-80">
      {loading && <Loading />}
      <Grid item xs={12} sm={12}>
        <Button
          type="primary"
          onClick={viewModal}
          className="defaultButton mb-15 text-dark"
        >
          Add new role
        </Button>
        <Table columns={columns} dataSource={data} />
        <Modal
          open={ModalOpen}
          onOk={handleClose}
          onCancel={handleClose}
          footer={null}
          style={{ width: 100, height: 150 }}
        >
          <Grid container alignItems="stretch">
            <Grid item xs={12} lg={12} className="row-new-post">
              <center>Create new role</center>
            </Grid>
            <Grid item xs={3} lg={3} />
            <Grid item xs={6} lg={6} className="row-new-post">
              <Input
                allowClear
                placeholder="Write the name of role"
                size="large"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ marginBottom: 15 }}
                required
              />
              <Button
                disabled={checkToRole()}
                type="primary"
                block
                onClick={onSubmit}
                className=" defaultButton text-dark"
              >
                Add new
              </Button>
            </Grid>
          </Grid>
        </Modal>
      </Grid>
    </Grid>
  );
};
export default Role;
