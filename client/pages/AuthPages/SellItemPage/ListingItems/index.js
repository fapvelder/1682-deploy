import { Grid } from "@material-ui/core";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Steps,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useContext, useEffect, useState } from "react";
import "./listingItems.css";
import { PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Schema from "async-validator";
import { checkOfferStatus, createListing, depositItem } from "../../../../api";
import { Store } from "../../../../Store";
import handleLoading from "../../../../component/HandleLoading";
import useLoading from "../../../../component/HandleLoading/useLoading";
import Loading from "../../../../component/Loading";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import Responsive from "../../../../component/ResponsiveCode/Responsive";
import vi from "../../../../component/languages/vi.json";
import en from "../../../../component/languages/en.json";

const { Option } = Select;
export default function ListingItem() {
  const location = useLocation();
  const { state } = useContext(Store);
  const navigate = useNavigate();
  const { loading, setLoading, reload, setReload } = useLoading();
  const userID = state?.data?._id;
  const [item, setItem] = useState("");
  const [url, setURL] = useState("");
  const [photos, setPhotos] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState();
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const language = state?.language || "en";
  useEffect(() => {
    if (location?.state) {
      let state = location?.state;
      setItem(state.item);
      setURL(state.url);
      setTitle(state.title || "");
      setDescription(
        Array.isArray(state.description)
          ? state?.description?.map((desc) => desc?.value).join("\n")
          : state?.description || ""
      );
      setCategory(state.category);
      setSubCategory(state.subCategory);
      setSuggestedPrice(state.suggestedPrice);
      setGameTitle(state.gameTitle);
    }
  }, [location?.state]);
  const [fileList, setFileList] = useState([]);
  const [digitalFee, setDigitalFee] = useState(0);
  const [commissionFee, setCommissionFee] = useState(0);
  const [finalIncome, setFinalIncome] = useState(0);
  const [price, setPrice] = useState(0);
  const [visibility, setVisibility] = useState("Public");
  const [deliveryIn, setDeliveryIn] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [tradeOffer, setTradeOffer] = useState("");
  const [id, setID] = useState("");
  const [completeTrade, setCompleteTrade] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [current, setCurrent] = useState(0);
  const showModalCode = () => {
    setDeliveryIn("");
    setIsModalOpen(true);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setDeliveryIn("Auto");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  useEffect(() => {
    if (completeTrade) {
      setDeliveryIn("Auto");
    }
  }, [completeTrade]);
  useEffect(() => {
    if (fileList) {
      setTimeout(() => setPhotos(fileList?.map((file) => file.thumbUrl)), 100);
    }
  }, [fileList]);
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
  const checkPrice = (e) => {
    if (e) {
      setPrice(e);
      setDigitalFee((e * 0.02).toFixed(2));
      setCommissionFee((e * 0.08).toFixed(2));
      setFinalIncome((e - digitalFee - commissionFee).toFixed(2));
    }
  };
  const handleDepositItem = async () => {
    const appID = item?.appid;
    const version = item?.contextid;
    const classID = item?.classID;
    const assetID = item?.assetID;
    handleLoading(
      async () => {
        const response = await depositItem(
          userID,
          appID,
          version,
          classID,
          assetID
        );
        setTradeOffer(response.data.tradeOfferUrl);
        setID(response.data.id);
        setCurrent(1);
      },
      setLoading,
      setReload,
      "Trade offer has been sent"
    );
  };

  const handleComplete = async () => {
    handleLoading(
      async () => {
        const offerID = tradeOffer?.split("/")[4];
        const response = await checkOfferStatus(offerID);
        if (response.data.message === "ACCEPTED") {
          setCompleteTrade(true);
          setDeliveryIn("auto");
        }
        setCurrent(2);
      },
      setLoading,
      setReload,
      "Trade offer has been completed"
    );
  };
  const checkToContinue = () => {
    return (
      userID === "" ||
      title === "" ||
      description === "" ||
      price === 0 ||
      deliveryIn === "" ||
      deliveryMethod === "" ||
      category === "" ||
      subCategory === "" ||
      visibility === "" ||
      (url ? url === "" : photos.length === 0)
    );
  };

  const createListingItem = async () => {
    const hasSufficientElements =
      userID &&
      title &&
      description &&
      price >= 1 &&
      deliveryIn &&
      deliveryMethod &&
      category &&
      subCategory &&
      visibility;
    if (hasSufficientElements) {
      handleLoading(
        async () => {
          await createListing(
            userID,
            title,
            description,
            price,
            deliveryIn,
            deliveryMethod,
            category,
            subCategory,
            visibility,
            gameTitle ? gameTitle : "",
            url ? url : photos,
            deliveryMethod === "Bot" && completeTrade ? item : "", // item
            deliveryMethod === "Auto" ? code : "" // code
          );

          setCompleteTrade(false);
          setItem("");
          setDeliveryMethod("");
          setCurrent(0);
          navigate("/");
        },
        setLoading,
        setReload,
        "Product listing successfully"
      );
    }
  };
  const { mobile } = Responsive();

  return (
    <Grid container className="pb-50">
      {loading && <Loading />}
      <div className="mg-auto-80 mt-15">
        <Grid container className="mg-auto-80 selectCustom">
          <Grid container className="customSection">
            <h3>
              <span>
                {language === "en"
                  ? en.start_selling.listings.screenshots
                  : vi.start_selling.listings.screenshots}
              </span>
            </h3>
            <Grid container>
              <div style={{ padding: 10 }}>
                <p>
                  {language === "en"
                    ? en.start_selling.listings.descPhoto
                    : vi.start_selling.listings.descPhoto}
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
              <span>
                {" "}
                {language === "en"
                  ? en.start_selling.listings.description
                  : vi.start_selling.listings.description}
              </span>
            </h3>
            <Grid container>
              <div style={{ padding: 15 }}>
                <p>
                  {language === "en"
                    ? en.start_selling.listings.desc
                    : vi.start_selling.listings.desc}
                </p>
                <Input
                  value={title}
                  placeholder={
                    title
                      ? title
                      : language === "en"
                      ? en.start_selling.listings.placeholder_title
                      : vi.start_selling.listings.placeholder_title
                  }
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextArea
                  value={description}
                  placeholder={
                    description
                      ? description
                      : language === "en"
                      ? en.start_selling.listings.placeholder_desc
                      : vi.start_selling.listings.placeholder_desc
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
              <span>
                {" "}
                {language === "en"
                  ? en.start_selling.listings.category
                  : vi.start_selling.listings.category}
              </span>
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
                        {language === "en"
                          ? en.start_selling.listings.title
                          : vi.start_selling.listings.title}
                      </Grid>
                      <Grid item xs={7} sm={7} md={7}>
                        {gameTitle}
                      </Grid>
                    </Grid>
                  )}
                  <Grid container className="bd-bt">
                    <Grid item xs={4} sm={4} md={4}>
                      {language === "en"
                        ? en.start_selling.listings.category
                        : vi.start_selling.listings.category}
                    </Grid>
                    <Grid item xs={7} sm={7} md={7}>
                      {category}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={4} sm={4} md={4}>
                      {language === "en"
                        ? en.start_selling.listings.platform
                        : vi.start_selling.listings.platform}
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
              <span>
                {" "}
                {language === "en"
                  ? en.start_selling.listings.delivery_method
                  : vi.start_selling.listings.delivery_method}
              </span>
            </h3>
            <Grid container>
              <Radio.Group
                onChange={(e) => setDeliveryMethod(e.target.value)}
                // value={deliveryMethod}
                style={{ padding: 15 }}
              >
                <Space direction="vertical">
                  {category === "Game Items" ? (
                    <Radio value="Bot" onClick={showModal}>
                      {language === "en"
                        ? en.start_selling.listings.automatic_bot
                        : vi.start_selling.listings.automatic_bot}
                    </Radio>
                  ) : (
                    <Radio value="Auto" onClick={showModalCode}>
                      {language === "en"
                        ? en.start_selling.listings.automatic
                        : vi.start_selling.listings.automatic}
                    </Radio>
                  )}

                  <Radio value="Transfer" style={{ marginTop: 20 }}>
                    {language === "en"
                      ? en.start_selling.listings.transfer
                      : vi.start_selling.listings.transfer}
                  </Radio>
                  {deliveryMethod === "Transfer" && (
                    <Radio.Group
                      style={{ padding: 25 }}
                      onChange={(e) => setDeliveryIn(e.target.value)}
                    >
                      <Space direction="vertical">
                        <Radio value="1">
                          1{" "}
                          {language === "en"
                            ? en.start_selling.listings.days
                            : vi.start_selling.listings.days}
                        </Radio>
                        <Radio value="2">
                          2{" "}
                          {language === "en"
                            ? en.start_selling.listings.days
                            : vi.start_selling.listings.days}
                        </Radio>
                        <Radio value="3">
                          3{" "}
                          {language === "en"
                            ? en.start_selling.listings.days
                            : vi.start_selling.listings.days}
                        </Radio>
                      </Space>
                    </Radio.Group>
                  )}
                </Space>
              </Radio.Group>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>
                {" "}
                {language === "en"
                  ? en.start_selling.listings.price
                  : vi.start_selling.listings.price}
              </span>
            </h3>
            <Grid container>
              <div style={{ padding: 15 }}>
                {suggestedPrice && (
                  <p>
                    {" "}
                    {language === "en"
                      ? en.start_selling.listings.suggested_price
                      : vi.start_selling.listings.suggested_price}
                    : {suggestedPrice}{" "}
                  </p>
                )}
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

                <p>
                  {" "}
                  {language === "en"
                    ? en.start_selling.listings.descPrice
                    : vi.start_selling.listings.descPrice}
                </p>
              </div>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>
                {" "}
                {language === "en"
                  ? en.start_selling.listings.visibility
                  : vi.start_selling.listings.visibility}
              </span>
            </h3>
            <Grid container>
              <div style={{ padding: 15 }}>
                <Select
                  defaultValue="Public"
                  onChange={(e) => setVisibility(e)}
                  style={{ width: mobile ? "80%" : "20%" }}
                >
                  <Option value="Public">
                    {language === "en"
                      ? en.start_selling.listings.public
                      : vi.start_selling.listings.public}
                  </Option>
                  <Option value="Unlisted">
                    {language === "en"
                      ? en.start_selling.listings.Unlisted
                      : vi.start_selling.listings.Unlisted}
                  </Option>
                </Select>
                <p>
                  {language === "en"
                    ? en.start_selling.listings.descVisi
                    : vi.start_selling.listings.descVisi}
                </p>
              </div>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>
                {" "}
                {language === "en"
                  ? en.start_selling.listings.estimate
                  : vi.start_selling.listings.estimate}
              </span>
            </h3>
            <Grid container style={{ padding: 15 }}>
              <Grid container>
                <Grid item md={4}>
                  {language === "en"
                    ? en.start_selling.listings.digital_fee
                    : vi.start_selling.listings.digital_fee}
                  :
                </Grid>
                <Grid item md={8}>
                  {digitalFee ? `$${digitalFee} USD` : "$0.00 USD"}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={4}>
                  {language === "en"
                    ? en.start_selling.listings.commission_fee
                    : vi.start_selling.listings.commission_fee}
                  :
                </Grid>
                <Grid item md={8}>
                  {commissionFee ? `$${commissionFee} USD` : "$0.00 USD"}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={4}>
                  {language === "en"
                    ? en.start_selling.listings.you_make
                    : vi.start_selling.listings.you_make}
                  :
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
              onClick={() => createListingItem()}
            >
              {" "}
              {language === "en"
                ? en.start_selling.listings.done
                : vi.start_selling.listings.done}
            </Button>
          </Grid>
        </Grid>
      </div>
      {category === "Game Items" ? (
        <Modal
          title="Deposit item to Bot"
          open={isModalOpen}
          // onOk={handleOk}
          onCancel={handleCancel}
          width={800}
          height={500}
          footer={
            current === 0
              ? [
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button key="back" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleDepositItem()}
                      className="defaultButton"
                    >
                      Start Bot Trade
                    </Button>
                  </div>,
                ]
              : current === 1 &&
                tradeOffer && [
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      className="defaultButton"
                      onClick={() => handleComplete()}
                    >
                      I've completed Bot Trade
                    </Button>
                    <Button
                      className="defaultButton"
                      onClick={() => window.open(tradeOffer)}
                    >
                      See trade offer
                    </Button>
                  </div>,
                ]
          }
        >
          {current === 0 ? (
            <div>
              <div>
                Our GameBay Bot will hold your item and deliver to buyer when
                your listing is sold. When you click Start, a GameBay bot will
                send you a trade offer in Steam using your Steam Trade URL. The
                trade offer is automatically cancelled if you do not accept
                within 5 minutes.
              </div>
              <br />
              <div>
                You must be logged in Steam and have your Steam Guard Mobile
                ready for trading.
              </div>
              <div>Having problems to deposit your item?</div>
              <Button
                className="defaultButton"
                onClick={() => window.open("https://steamstat.us/")}
              >
                Check the current Steam status.
              </Button>
            </div>
          ) : current === 1 ? (
            <div>
              <div>
                Please verify that the bot trade offer references the following
                Listing ID
              </div>
              <center>{id}</center>
              <div>
                Once you successfully traded with GameBay Steam bot, please
                confirm below.
              </div>
            </div>
          ) : (
            current === 2 && <div>Thank you for depositing item</div>
          )}
          {/* <div onClick={() => handleDepositItem()}>Deposit Item</div> */}
          <Steps
            style={{ marginTop: 15 }}
            labelPlacement="vertical"
            current={current}
            items={[
              {
                title: "Start Bot Trade",
              },
              {
                title: "Accept Bot Trade In Steam",
                icon: current === 1 && <LoadingOutlined />,
              },
              {
                title: "Complete Bot Trade",
              },
            ]}
          />
        </Modal>
      ) : (
        <Modal
          title="Provide digital or key code"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={800}
          height={500}
          footer={[
            <Button key="submit" type="primary" onClick={handleOk}>
              Submit
            </Button>,
          ]}
        >
          <Grid container>
            <TextArea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the redemption code"
              style={{ marginTop: 10 }}
              autoSize={{ minRows: 6, maxRows: 10 }}
            ></TextArea>
            <div>
              Important:
              <p>
                Be sure to enter the correct code or card number and PIN. Buyer
                will request refund if card cannot be redeemed.
              </p>
            </div>
          </Grid>
        </Modal>
      )}
    </Grid>
  );
}
