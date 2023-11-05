import React, { useContext, useEffect, useState } from "react";
import ChatContainer from "../ChatContainer";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import {
  getAllUsers,
  getLastMessage,
  getUserBySlug,
  haveChattedBefore,
} from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import UserDetails from "../UserDetails";
import { Grid } from "@material-ui/core";
import "./Contact.css";

export default function Contact() {
  const { state } = useContext(Store);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState("");
  const [haveChattedUsers, setHaveChattedUsers] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({}); // State to store last messages
  const [reload, setReload] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const data = jwtDecode(state.token);
  const id = data._id;
  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await getAllUsers();
        setUsers(result.data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    getUsers();
  }, [haveChattedUsers]);
  useEffect(() => {
    const getUser = async () => {
      if (slug) {
        try {
          const result = await getUserBySlug(slug);
          handleUser(result.data);
        } catch (err) {
          toast.error(getError(err));
        }
      }
    };
    getUser();
  }, [slug]);
  useEffect(() => {
    const haveChatted = async () => {
      try {
        const result = await haveChattedBefore(id);
        setHaveChattedUsers(result.data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    haveChatted();
  }, [id]);
  useEffect(() => {
    const filtered = users.filter((user) =>
      haveChattedUsers.includes(user._id)
    );
    setListUsers(filtered);
  }, [haveChattedUsers, users]);
  const handleUser = async (e) => {
    setCurrentChatUser(e);
  };
  const handleChat = async (user) => {
    navigate(`/chat/${user.slug}`);
    setActiveUser(user._id);
  };
  useEffect(() => {
    const getLastMessages = async () => {
      try {
        const lastMessagesData = {};
        for (const user of listUsers) {
          if (user._id !== id) {
            const result = await getLastMessage(id, user._id);
            lastMessagesData[user._id] = result.data;
          }
        }
        setLastMessages(lastMessagesData);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    if (listUsers?.length > 0) {
      getLastMessages();
    }
  }, [id, listUsers, reload]);
  const handleReload = () => {
    setReload(!reload);
  };
  return (
    <Grid container className="chatContainer pb-50">
      <Grid container className="mg-auto-80 bodyChat">
        <Grid item xs={12} sm={3} md={3}>
          <div className="listUsersContainer">
            {listUsers?.map(
              (user) =>
                user._id !== id && (
                  <div
                    className={`userContainer ${
                      activeUser === user._id ? "activeUser" : ""
                    }`}
                    onClick={() => handleChat(user)}
                    // onClick={() => navigate(`/chat/${user.slug}`)}
                    key={user._id}
                  >
                    <img src={user.avatar} className="Chatuserimage" alt="" />
                    <div style={{ marginLeft: "10px" }}>
                      <p
                        style={{
                          textAlign: "start",
                          marginTop: "8px",
                          fontSize: "15px",
                        }}
                      >
                        {user.fullName}
                      </p>
                      <p
                        style={{
                          textAlign: "start",
                          marginTop: "-16px",
                          fontSize: "12px",
                        }}
                      >
                        {lastMessages[user._id]?.message.length > 40
                          ? `${lastMessages[user._id]?.message.substring(
                              0,
                              40
                            )}...`
                          : lastMessages[user._id]?.message}
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>
        </Grid>
        <Grid item xs={12} sm={9} md={9}>
          {currentChatUser !== "" ? (
            <ChatContainer
              reload={reload}
              onReload={handleReload}
              currentChatUser={currentChatUser}
            />
          ) : (
            <div style={{ marginLeft: "40px", marginTop: "10px" }}>
              <p style={{ fontSize: "30px", color: "#876b70" }}>
                Open your chat message with your friends
              </p>
            </div>
          )}
        </Grid>
      </Grid>
      {currentChatUser !== "" && (
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <UserDetails currentChatUser={currentChatUser} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
