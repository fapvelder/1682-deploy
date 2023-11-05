import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Modal, Space, Table } from "antd";
import { toast } from "react-toastify";
import React from "react";
import { Link } from "react-router-dom";
import { Select, Collapse } from "antd";
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  fetchCategories,
  fetchPlatforms,
} from "../../../api";
import { getError } from "../../../utils";
import "./category.css";
import Loading from "../../../component/Loading";
import handleLoading from "../../../component/HandleLoading";
import useLoading from "../../../component/HandleLoading/useLoading";
const { Panel } = Collapse;
const { Option } = Select;
const Category = () => {
  const { loading, setLoading, reload, setReload } = useLoading();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryDesc, setCategoryDesc] = useState("");
  // const [reload, setReload] = useState(false);
  const [platforms, setPlatforms] = useState("");

  const [previewSource, setPreviewSource] = useState("");
  const [previewSourceCategory, setPreviewSourceCategory] = useState("");
  // const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const result = await fetchCategories();
        setCategories(result.data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchAllCategories();
  }, [reload]);

  const data = categories?.map((category) => ({
    key: category?._id,
    category: category?.name,
    subCategory: category?.subCategory?.map((subCategory) => ({
      id: subCategory?._id,
      name: subCategory?.subCategoryName?.name,
      title: subCategory?.title,
      image: subCategory?.image,
    })),
  }));
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "90%",
      render: (text, record) => (
        <Collapse
          className="collapseCategory"
          collapsible={record.subCategory.length > 0 ? "icon" : "disabled"}
        >
          <Panel
            header={
              <span>
                {text}
                <Button
                  onClick={() => {
                    viewSubCategoryModal();
                    setCategoryID(record.key);
                  }}
                  className="ml-15 defaultButton"
                >
                  +
                </Button>
              </span>
            }
          >
            <table className="categoryTable">
              <thead>
                <tr>
                  <th>Sub Category</th>
                  <th>Title</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {record.subCategory.length > 0 &&
                  record.subCategory.map((item) => (
                    <tr key={item?.id}>
                      <td>{item?.name}</td>
                      <td>{item?.title ? item?.title : "No title"}</td>
                      <td>
                        {item?.image ? (
                          <img
                            src={item?.image}
                            alt=""
                            style={{ width: 70, height: 70 }}
                          />
                        ) : (
                          <p>No image</p>
                        )}
                      </td>
                      <td>
                        <Button
                          className="defaultButton"
                          onClick={() => {
                            deleteSubcategoryHandler(item.id, record.key);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Panel>
        </Collapse>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <Link
            className="tableButton"
            onClick={() => deleteCategoryHandler(record)}
          >
            Delete
          </Link>
        </Space>
      ),
    },
  ];

  const deleteCategoryHandler = async (record) => {
    if (window.confirm("Are you sure to delete this category?")) {
      const id = record.key;
      handleLoading(
        async () => {
          await deleteCategory(id);
        },
        setLoading,
        setReload,
        "Category deleted successfully"
      );
    }
  };
  const deleteSubcategoryHandler = async (subCategoryID, categoryID) => {
    if (window.confirm("Are you sure to delete this sub-category?")) {
      handleLoading(
        async () => {
          await deleteSubCategory(categoryID, subCategoryID);
        },
        setLoading,
        setReload,
        "Sub-category deleted successfully"
      );
    }
  };

  const onSubmit = async () => {
    const img = previewSourceCategory;
    handleLoading(
      async () => {
        await createCategory(category, img, categoryDesc);
      },
      setLoading,
      setReload,
      "Category created successfully"
    );
    handleClose();
  };
  const onSubmitSubCategory = async () => {
    const img = previewSource;
    handleLoading(
      async () => {
        await createSubCategory(categoryID, subCategory, title, img);
      },
      setLoading,
      setReload,
      "Sub-Category created successfully"
    );
    handleSubCategoryClose();
  };

  const [ModalOpen, setModalOpen] = useState(false);
  const handleClose = () => {
    setModalOpen(false);
    setCategory("");
    setCategoryDesc("");
    const fileInputCategory = document.getElementById("fileInputCategory");
    if (fileInputCategory) {
      fileInputCategory.value = "";
    }
  };

  const viewModal = React.useCallback(() => {
    setModalOpen(true);
  }, []);

  const [subCategoryModalOpen, setSubCategoryModalOpen] = useState(false);
  const handleSubCategoryClose = () => {
    setSubCategory("Choose a Sub-Category");

    setSubCategoryModalOpen(false);
    setTitle("");
    setPreviewSource("");
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const viewSubCategoryModal = React.useCallback(() => {
    setSubCategoryModalOpen(true);
  }, []);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    file && previewFile(file);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };
  const handleCategoryFileInputChange = (e) => {
    const file = e.target.files[0];
    file && previewCategoryFile(file);
  };
  const previewCategoryFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSourceCategory(reader.result);
    };
  };
  const checkToCategory = () => {
    return category === "";
  };
  const checkToSubCategory = () => {
    return subCategory === "";
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
          Add new category
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
              <center>Create new category</center>
            </Grid>
            <Grid item xs={3} lg={3} />
            <Grid item xs={6} lg={6} className="row-new-post">
              <Input
                allowClear
                placeholder="Write the name of category"
                size="large"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ marginBottom: 15 }}
                required
              />
              <Input
                allowClear
                placeholder="Write the description for category"
                size="large"
                value={categoryDesc}
                onChange={(e) => setCategoryDesc(e.target.value)}
                style={{ marginBottom: 15 }}
                required
              />
              <input
                style={{ marginBottom: 15 }}
                type="file"
                id="fileInputCategory"
                onChange={handleCategoryFileInputChange}
              />
              <Button
                disabled={checkToCategory()}
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
      <Modal
        open={subCategoryModalOpen}
        onOk={handleSubCategoryClose}
        onCancel={handleSubCategoryClose}
        footer={null}
        style={{ width: 100, height: 150 }}
      >
        <Grid container>
          <Grid item xs={12} lg={12}>
            <center>Create new sub-category</center>
          </Grid>
          <Input
            allowClear
            placeholder="Write the title (Optional)"
            size="large"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: 15 }}
            required
          />

          <Select
            defaultValue={"Choose a Sub-Category"}
            value={subCategory}
            onChange={(e) => setSubCategory(e)}
            style={{ width: "100%", marginBottom: 15 }}
          >
            {platforms &&
              platforms?.map((pf) => (
                <Option key={pf?._id} value={pf?._id}>
                  {pf?.name}
                </Option>
              ))}
          </Select>

          <input
            style={{ marginBottom: 15 }}
            type="file"
            id="fileInput"
            onChange={handleFileInputChange}
          />
          <Button
            disabled={checkToSubCategory()}
            type="primary"
            block
            onClick={onSubmitSubCategory}
            className="defaultButton text-dark"
          >
            Add new
          </Button>
        </Grid>
      </Modal>
    </Grid>
  );
};

export default Category;
