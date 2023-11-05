import { Grid } from "@material-ui/core";
import { Button, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useContext, useEffect, useState } from "react";
import "./account.css";
import {
  addBio,
  addCommunication,
  addDisplayAs,
  deleteCommunication,
  deleteSteamID,
  getSteam,
  getUserByID,
  serverURL,
  signInSteam,
  updateSteamURL,
  uploadAvatar,
} from "../../../../api";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getError } from "../../../../utils";
import { CloseCircleTwoTone } from "@ant-design/icons";
import { Store } from "../../../../Store";
import vi from "../../../../component/languages/vi.json";
import en from "../../../../component/languages/en.json";
import Loading from "../../../../component/Loading";
import useLoading from "../../../../component/HandleLoading/useLoading";
import handleLoading from "../../../../component/HandleLoading";
import axios from "axios";
import steamLogin from "../../../../component/img/steamlogin.png";
import Responsive from "../../../../component/ResponsiveCode/Responsive";
const { Option } = Select;
export default function Account({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, setLoading, reload, setReload } = useLoading();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const userLanguage = state.language || "en";
  useEffect(() => {
    const getUser = async () => {
      if (user) {
        try {
          const result = await getUserByID(user._id);
          ctxDispatch({ type: "SET_DATA", payload: result.data });
        } catch (err) {
          toast.error(getError(err));
        }
      }
    };
    getUser();
  }, [ctxDispatch, reload]);

  const [language, setLanguage] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [bio, setBio] = useState("");
  const [displayAs, setDisplayAs] = useState("");

  const [fileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [toggleEdit, setToggleEdit] = useState(false);
  const [toggleEditInput, setToggleEditInput] = useState(false);
  const [items, setItems] = useState([]);
  const [steamID, setSteamID] = useState("");
  const [steamURL, setSteamURL] = useState("");
  const handleButtonClick = () => {
    document.getElementById("image").click();
  };
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
  const addCommunicationHandler = async () => {
    if (language && proficiency) {
      handleLoading(
        async () => {
          await addCommunication(user._id, language, proficiency);
        },
        setLoading,
        setReload,
        "Add communication successfully"
      );
    }
  };
  const deleteCommunicationHandler = async (id) => {
    const communicationID = id;
    handleLoading(
      async () => {
        await deleteCommunication(user._id, communicationID);
      },
      setLoading,
      setReload,
      "Delete communication successfully"
    );
  };
  const addBioHandler = async () => {
    handleLoading(
      async () => {
        await addBio(user._id, bio);
      },
      setLoading,
      setReload,
      "Add bio successfully"
    );
  };
  const addDisplayAsHandler = async () => {
    handleLoading(
      async () => {
        await addDisplayAs(user._id, displayAs);
      },
      setLoading,
      setReload,
      "Add successfully"
    );
  };
  const updateAvatarHandler = async () => {
    let data = previewSource;
    handleLoading(
      async () => {
        await uploadAvatar(user._id, data);
      },
      setLoading,
      setReload,
      "Update avatar successfully"
    );
  };
  const signIn = async () => {
    // await signInSteam();
    fetch(`${serverURL}/steam/auth/steam/return/`, {
      method: "GET",
      headers: {
        Authorization: "Bearer ", // Add your authentication token here
        "Custom-Header": "Custom-Header-Value", // Add any other custom headers here
      },
    });
    // window.open(`${serverURL}/steam/auth/steam/return/?userid=1234`);
  };
  const deleteSteam = async () => {
    handleLoading(
      async () => {
        await deleteSteamID(state?.data?.profile?.steam?.steamID);
      },
      setLoading,
      setReload,
      "Delete SteamID successfully"
    );
    // try {
    //   await deleteSteamID(state?.data?.profile?.steam?.steamID);
    // } catch (err) {
    //   toast.error(getError(err));
    // }
  };
  const handleUpdateTradeURL = async () => {
    handleLoading(
      async () => {
        const userID = state?.data?._id;
        await updateSteamURL(userID, steamURL);
      },
      setLoading,
      setReload,
      "Update Trade URL successfully"
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const err = params.get("err");
    if (err) {
      console.log(err);
      toast.error("Cannot duplicate user");
    }
    // const userData = JSON.parse(decodeURIComponent(user));
    // setSteamID(userData?._json.steamid);
  }, [location]);
  const { tablet, mobile, minipad } = Responsive();

  return (
    <Grid container className="account">
      {loading && <Loading />}
      <h4>
        {userLanguage === "en"
          ? en.settings.account.personal_information
          : vi.settings.account.personal_information}
      </h4>
      <Grid container className="text-start ">
        <Grid container className="mt-15">
          <Grid item xs={2} sm={2} md={2}>
            {userLanguage === "en"
              ? en.settings.account.name
              : vi.settings.account.name}
          </Grid>
          <Grid item xs={10} sm={10} md={10}>
            {user?.fullName}
          </Grid>
        </Grid>
        <Grid container className="mt-15">
          <Grid item xs={2} sm={2} md={2}>
            {userLanguage === "en"
              ? en.settings.account.phone_number
              : vi.settings.account.phone_number}
          </Grid>
          <Grid item xs={10} sm={10} md={10}>
            {user?.phoneNumber || "No phone number"}
          </Grid>
        </Grid>
        <Grid container className="mt-15">
          <Grid item xs={2} sm={2} md={2}>
            Email
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <Input className="inputDisabled" value={user?.email} disabled />
          </Grid>
        </Grid>
      </Grid>
      <h4>
        {" "}
        {userLanguage === "en"
          ? en.settings.account.public_profile
          : vi.settings.account.public_profile}
      </h4>
      <Grid container className="text-start">
        <Grid container className="mt-15">
          <Grid item xs={2} sm={2} md={2}>
            {userLanguage === "en"
              ? en.settings.account.avatar
              : vi.settings.account.avatar}
          </Grid>
          <Grid item xs={10} sm={10} md={10}>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileInputChange}
              value={fileInputState}
              style={{ display: "none" }}
            />

            {previewSource ? (
              <div className="avatar-container">
                <img
                  src={previewSource}
                  alt="chosen"
                  className="avatar-image"
                  onChange={handleFileInputChange}
                  value={fileInputState}
                />
                <label htmlFor="image">
                  <Button
                    className="avatar-button"
                    onClick={() => handleButtonClick()}
                  >
                    <i className="fas fa-camera"></i>
                  </Button>
                </label>
              </div>
            ) : (
              <div className="avatar-container">
                <img
                  src={user?.avatar}
                  alt={user?.fullName}
                  className="avatar-image"
                />
                <label htmlFor="image">
                  <Button
                    className="avatar-button"
                    onClick={() => handleButtonClick()}
                  >
                    <i className="fas fa-camera"></i>
                  </Button>
                </label>
              </div>
            )}
            {previewSource && (
              <Button
                className="defaultButton ml-15"
                onClick={() => updateAvatarHandler()}
              >
                {userLanguage === "en"
                  ? en.settings.account.btn.upload
                  : vi.settings.account.btn.upload}
              </Button>
            )}
          </Grid>
        </Grid>

        <Grid container className="mt-15">
          <Grid item xs={4} sm={2} md={2} style={{ marginTop: 5 }}>
            {userLanguage === "en"
              ? en.settings.account.display_as
              : vi.settings.account.display_as}
          </Grid>
          <Grid item xs={8} sm={6} md={6} style={{ marginTop: 5 }}>
            <div className="inputGroup">
              <Input
                className="customInputAntd-1"
                placeholder={user?.displayName}
                style={{ width: mobile ? "60%" : minipad ? "70%" : "80%" }}
                onClick={() => setToggleEditInput(true)}
                onChange={(e) => setDisplayAs(e.target.value)}
              />
              {!toggleEditInput ? (
                <div className="inputGroupAppend">
                  <button
                    className="borderRight"
                    onClick={() => setToggleEditInput(!toggleEditInput)}
                  >
                    <i className="fas fa-pen" />
                  </button>
                </div>
              ) : (
                <div className="inputGroupAppend">
                  <button
                    className="leftButton"
                    onClick={() => addDisplayAsHandler()}
                  >
                    <i className="fas fa-check" />
                  </button>
                  <button
                    className="borderRight"
                    onClick={() => setToggleEditInput(!toggleEditInput)}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              )}
            </div>
          </Grid>
        </Grid>

        <Grid container className="mt-15">
          <Grid item xs={4} sm={2} md={2} style={{ marginTop: 5 }}>
            {userLanguage === "en"
              ? en.settings.account.bio
              : vi.settings.account.bio}
          </Grid>
          <Grid item xs={8} sm={6} md={6} style={{ marginTop: 5 }}>
            <div className="inputGroup">
              <TextArea
                className="customInputAntd-1"
                placeholder={user?.profile?.bio}
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
                style={{ width: mobile ? "60%" : minipad ? "70%" : "80%" }}
                onClick={() => setToggleEdit(true)}
                onChange={(e) => setBio(e.target.value)}
              />
              {!toggleEdit ? (
                <div className="inputGroupAppend">
                  <button
                    className="borderRight"
                    onClick={() => setToggleEdit(!toggleEdit)}
                  >
                    <i className="fas fa-pen" />
                  </button>
                </div>
              ) : (
                <div className="inputGroupAppend">
                  <button
                    className="leftButton"
                    onClick={() => addBioHandler()}
                  >
                    <i className="fas fa-check" />
                  </button>
                  <button
                    className="borderRight"
                    onClick={() => setToggleEdit(!toggleEdit)}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="text-start">
        <Grid container className="mt-15">
          <Grid item xs={4} sm={3} md={3}>
            {userLanguage === "en"
              ? en.settings.account.languages.language
              : vi.settings.account.languages.language}
          </Grid>
          <Grid item xs={8} sm={6} md={6}>
            {userLanguage === "en"
              ? en.settings.account.languages.proficiency
              : vi.settings.account.languages.proficiency}
          </Grid>
        </Grid>

        {user?.profile?.communication?.length > 0 &&
          user?.profile?.communication?.map((communication) => (
            <Grid
              container
              key={communication._id}
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              <Grid item xs={5} sm={3} md={3}>
                {communication?.language}
              </Grid>
              <Grid item xs={6} sm={2} md={2}>
                {communication?.proficiency}
              </Grid>
              <Grid item xs={1} sm={4} md={4}>
                <div
                  onClick={() => deleteCommunicationHandler(communication._id)}
                >
                  <CloseCircleTwoTone
                    twoToneColor="red"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Grid>
            </Grid>
          ))}
        <Grid container className="mt-15">
          <Grid item xs={5} sm={3} md={3}>
            <Select
              defaultValue={"Language"}
              onChange={(e) => setLanguage(e)}
              style={{ width: 125 }}
            >
              <Option value="English">English</Option>
              <Option value="Vietnamese">Vietnamese</Option>
              <Option value="Chinese">Chinese</Option>
              <Option value="Japanese">Japanese</Option>
            </Select>
          </Grid>
          <Grid item xs={6} sm={2} md={2}>
            <Select
              defaultValue={"Proficiency"}
              onChange={(e) => setProficiency(e)}
              style={{ width: 125 }}
            >
              <Option value="Native">Native</Option>
              <Option value="Fluent">Fluent</Option>
              <Option value="Conversational">Conversational</Option>
              <Option value="Basic">Basic</Option>
            </Select>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Button
              className="defaultButton"
              onClick={() => addCommunicationHandler()}
            >
              {userLanguage === "en"
                ? en.settings.account.btn.add
                : vi.settings.account.btn.add}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <h4>
        {userLanguage === "en"
          ? en.settings.account.steam_connect
          : vi.settings.account.steam_connect}
      </h4>
      {/* <Button onClick={() => getItem()}>Get Item</Button>
        <Button onClick={() => getPrice()}>Get Price</Button>
        <Button onClick={() => getCookie()}>Get Cookie</Button>
        <Button onClick={() => getUserSteam()}>Get User Steam</Button> */}
      {state?.data?.profile?.steam?.steamID ? (
        <Grid container className="mt-15">
          <Grid item xs={12} sm={8} md={8}>
            <div className="steamConnect">
              <p className="text-start ml-15 mt-15">
                {userLanguage === "en"
                  ? en.settings.account.steam_desc
                  : vi.settings.account.steam_desc}
              </p>
              <div className="text-start ml-15 ">
                Trade URL:{" "}
                <Input
                  style={{ width: "70%" }}
                  placeholder={
                    state?.data?.profile?.steam?.steamTradeURL ||
                    "Input your trade URL"
                  }
                  onChange={(e) => setSteamURL(e.target.value)}
                />
                <i
                  style={{ marginLeft: 5 }}
                  onClick={() =>
                    window.open(
                      `${state?.data?.profile?.steam?.steamURL}/tradeoffers/privacy#trade_offer_access_url`
                    )
                  }
                  className="fas fa-external-link-alt"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: 25,
                }}
              >
                <div>
                  <Button
                    className="defaultButton"
                    onClick={() => deleteSteam()}
                  >
                    Delete SteamID
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => handleUpdateTradeURL()}
                    className="updateTradeButton"
                  >
                    {" "}
                    {userLanguage === "en"
                      ? en.settings.account.btn.update
                      : vi.settings.account.btn.update}
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      ) : (
        <Grid container className="mt-15">
          <Grid item xs={12} sm={8} md={8}>
            <div className="steamConnect">
              <p className="text-start ml-15 mt-15">
                Connect your Steam account with GameBay. You can only connect
                one Steam account with GameBay, and you cannot connect another
                Steam account at any time later.
              </p>

              <Link to={`${serverURL}/steam/auth/steam/return/?userid=1234`}>
                {/* <div onClick={() => signIn()}> */}
                <img
                  src={steamLogin}
                  alt="Steam Logo"
                  style={{ marginRight: "5px", width: "250px", height: "30px" }}
                />
                {/* </div> */}
              </Link>
            </div>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
