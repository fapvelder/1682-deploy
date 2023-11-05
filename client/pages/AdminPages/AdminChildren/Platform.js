import { Grid } from "@material-ui/core";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Modal, Space, Table } from "antd";
import { toast } from "react-toastify";
import React from "react";
import { Link } from "react-router-dom";
import { Select } from "antd";
import { createPlatform, deletePlatform, fetchPlatforms } from "../../../api";
import { getError } from "../../../utils";
import useLoading from "../../../component/HandleLoading/useLoading";
import handleLoading from "../../../component/HandleLoading";
import Loading from "../../../component/Loading";
const Platform = () => {
  const [platform, setPlatform] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const { loading, setLoading, reload, setReload } = useLoading();
  useEffect(() => {
    const fetchAllPlatforms = async () => {
      try {
        const result = await fetchPlatforms();
        setPlatforms(result.data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchAllPlatforms();
  }, [reload]);
  const data = platforms?.map((platform) => ({
    key: platform?._id,
    platform: platform?.name,
  }));
  const columns = [
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
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
            onClick={() => deletePlatformHandler(record)}
          >
            Delete
          </Link>
        </Space>
      ),
    },
  ];

  const deletePlatformHandler = async (record) => {
    if (window.confirm("Are you sure to delete this platform?")) {
      const id = record.key;
      handleLoading(
        async () => {
          await deletePlatform(id);
        },
        setLoading,
        setReload,
        "Platform deleted successfully"
      );
    }
  };
  const onSubmit = async () => {
    handleLoading(
      async () => {
        createPlatform(platform);
      },
      setLoading,
      setReload,
      "Platform created successfully"
    );
    handleClose();
  };
  const [ModalOpen, setModalOpen] = useState(false);
  const handleClose = React.useCallback(() => {
    setModalOpen(false);
    setPlatform("");
  }, []);
  const viewModal = React.useCallback(() => {
    setModalOpen(true);
  }, []);
  const checkToPlatform = () => {
    return platform === "";
  };
  return (
    <Grid container alignItems="stretch" className="mg-auto-80">
      {loading && <Loading />}
      <Grid item xs={12} sm={12}>
        <Button
          type="primary"
          onClick={viewModal}
          className="mb-15 defaultButton text-dark"
        >
          Add new platform
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
              <center>Create new platform</center>
            </Grid>
            <Grid item xs={3} lg={3} />
            <Grid item xs={6} lg={6} className="row-new-post">
              <Input
                allowClear
                placeholder="Write the name of platform"
                size="large"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                style={{ marginBottom: 15 }}
                required
              />
              <Button
                disabled={checkToPlatform()}
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
export default Platform;
