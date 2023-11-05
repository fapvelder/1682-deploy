import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { Store } from "../../../Store";
import handleLoading from "../../../component/HandleLoading";
import useLoading from "../../../component/HandleLoading/useLoading.js";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { editProduct, getProductDetails } from "../../../api";
import { Button, Form, Input, InputNumber, Select, Upload } from "antd";
import Responsive from "../../../component/ResponsiveCode/Responsive";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

export default function EditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { loading, setLoading, reload, setReload } = useLoading();
  const [product, setProduct] = useState("");
  const [url, setURL] = useState("");
  const [photos, setPhotos] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState();
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [digitalFee, setDigitalFee] = useState(0);
  const [commissionFee, setCommissionFee] = useState(0);
  const [finalIncome, setFinalIncome] = useState(0);
  const [price, setPrice] = useState(0);
  const [visibility, setVisibility] = useState("Public");
  const [deliveryIn, setDeliveryIn] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");

  useEffect(() => {
    const getDetails = async () => {
      const id = params?.productID;

      const result = await getProductDetails(id);
      setProduct(result.data);
    };
    getDetails();
  }, [params?.productID, reload]);
  useEffect(() => {
    if (product) {
      setURL(product?.photos[0]);
      setTitle(product?.title || "");
      setDescription(
        Array.isArray(product.description)
          ? product?.description?.map((desc) => desc?.value).join("\n")
          : product?.description || ""
      );
      setCategory(product?.category?.name);
      setSubCategory(product?.platform?.name);
      setSuggestedPrice(product?.suggestedPrice);
      setGameTitle(product?.gameTitle);
    }
  }, [product]);

  useEffect(() => {
    const checkUser = () => {
      if (product && state?.data?._id) {
        if (state?.data?._id !== product?.listingBy?._id) {
          navigate("/");
        }
      }
    };
    checkUser();
  }, [product, state?.data?._id, product?.listingBy?._id, navigate]);

  const { mobile } = Responsive();
  const checkPrice = (e) => {
    if (e) {
      setPrice(e);
      setDigitalFee((e * 0.02).toFixed(2));
      setCommissionFee((e * 0.08).toFixed(2));
      setFinalIncome((e - digitalFee - commissionFee).toFixed(2));
    }
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const checkToContinue = () => {
    return (
      title === "" ||
      description === "" ||
      price === 0 ||
      visibility === "" ||
      (url ? url === "" : photos.length === 0)
    );
  };
  const handleEditProduct = () => {
    handleLoading(
      async () => {
        await editProduct(
          state?.data?._id,
          product?._id,
          title,
          description,
          price,
          visibility
        );
      },
      setLoading,
      setReload,
      "Edit product successfully"
    );
  };
  return (
    <Grid container>
      <Helmet>
        <title>{product?.title}</title>
      </Helmet>
      <div className="mg-auto-80 mt-15">
        <Grid container className="mg-auto-80 selectCustom">
          <Grid container className="customSection">
            <h3>
              <span>Screenshots / Photos</span>
            </h3>
            <Grid container>
              <div style={{ padding: 10 }}>
                <p>
                  Your screenshots should clearly show what you are selling.
                  640x640 is recommended.
                </p>
                {url ? (
                  <div className="item-background">
                    <img
                      style={{
                        width: 160,
                        height: 160,
                      }}
                      src={url}
                      alt=""
                    />
                  </div>
                ) : (
                  <div>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleChange}
                      beforeUpload={() => false}
                      showUploadList={{
                        showPreviewIcon: false,
                      }}
                    >
                      {fileList.length >= 5 ? null : uploadButton}
                    </Upload>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>Description</span>
            </h3>
            <Grid container>
              <div style={{ padding: 15 }}>
                <p>
                  The listing title and description must be accurate and as
                  informative as possible (no random or lottery-like listing).
                  Misleading description is a violation of our terms of service.
                </p>
                <Input
                  value={title}
                  placeholder={title ? title : "Game title or listing title"}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextArea
                  value={description}
                  placeholder={
                    description
                      ? description
                      : "Item description or Listing details"
                  }
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ marginTop: 10 }}
                  autoSize={{ minRows: 6, maxRows: 10 }}
                />
              </div>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>Category</span>
            </h3>
            <Grid container style={{ padding: 15 }}>
              <Grid item xs={12} sm={8} md={8}>
                <Grid
                  container
                  className="category"
                  style={{ gridGap: "10px", padding: "15px" }}
                >
                  {gameTitle && (
                    <Grid container className="bd-bt">
                      <Grid item xs={4} sm={4} md={4}>
                        Title
                      </Grid>
                      <Grid item xs={7} sm={7} md={7}>
                        {gameTitle}
                      </Grid>
                    </Grid>
                  )}
                  <Grid container className="bd-bt">
                    <Grid item xs={4} sm={4} md={4}>
                      Category
                    </Grid>
                    <Grid item xs={7} sm={7} md={7}>
                      {category}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={4} sm={4} md={4}>
                      Platform
                    </Grid>
                    <Grid item xs={7} sm={7} md={7}>
                      {subCategory}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container className="customSection">
            <h3>
              <span>Price</span>
            </h3>
            <Grid container>
              <div style={{ padding: 15 }}>
                {suggestedPrice && <p>Suggested Price: {suggestedPrice} </p>}
                <Form.Item>
                  <InputNumber
                    defaultValue={0}
                    formatter={(value) =>
                      `$ ${value}`?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    max={2000}
                    onChange={(e) => checkPrice(e)}
                  />
                </Form.Item>

                <p>Our marketplace is for items priced between $1 and $2500</p>
                <p>Compare to similar listings</p>
              </div>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>Visibility</span>
            </h3>
            <Grid container>
              <div style={{ padding: 15 }}>
                <Select
                  defaultValue="Public"
                  onChange={(e) => setVisibility(e)}
                  style={{ width: mobile ? "80%" : "20%" }}
                >
                  <Option value="Public">Public</Option>
                  <Option value="Unlisted">Unlisted</Option>
                </Select>
                <p>
                  Public listings can be seen and searched by anyone using
                  GameBay. Unlisted listings can be seen and shared by anyone
                  with the link.
                </p>
              </div>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>Estimate Fees & Proceeds</span>
            </h3>
            <Grid container style={{ padding: 15 }}>
              <Grid container>
                <Grid item md={4}>
                  Digital transfer fee:
                </Grid>
                <Grid item md={8}>
                  {digitalFee ? `$${digitalFee} USD` : "$0.00 USD"}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={4}>
                  Commission fee:
                </Grid>
                <Grid item md={8}>
                  {commissionFee ? `$${commissionFee} USD` : "$0.00 USD"}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={4}>
                  You make:
                </Grid>
                <Grid item md={8}>
                  {finalIncome ? `$${finalIncome} USD` : "$0.00 USD"}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container style={{ display: "flex", justifyContent: "end" }}>
            <Button
              className="defaultButton"
              disabled={checkToContinue()}
              onClick={() => handleEditProduct()}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}
