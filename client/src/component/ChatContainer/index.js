import React, { useContext, useEffect, useRef, useState } from "react";
import "./ChatContainer.css";
import { Store } from "../../Store";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { getError } from "../../utils";
import { io } from "socket.io-client";
import { getMessage, sendMessages, serverURL } from "../../api";
import Picker from "@emoji-mart/react";
import dataEmoji from "@emoji-mart/data";
import { SendOutlined } from "@ant-design/icons";
import { Grid } from "@material-ui/core";
export default function ChatContainer({ currentChatUser, onReload }) {
  const { state } = useContext(Store);
  const theme = localStorage.getItem("theme");
  const [message, setMessage] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null);

  const data = jwtDecode(state.token);
  const id = data._id;
  const scrollRef = useRef();
  const socket = useRef();
  const sendMessage = async () => {
    const newId = Math.random() * 10;
    if (inputMessage.length > 0) {
      const messages = {
        id: newId,
        myself: true,
        message: inputMessage,
      };
      socket.current.emit("send-msg", {
        to: currentChatUser._id,
        from: id,
        message: inputMessage,
      });
      await sendMessages(id, currentChatUser._id, inputMessage);
      setMessage(message.concat(messages));
      setInputMessage("");
      onReload();
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const result = await getMessage(id, currentChatUser._id);
        setMessage(result.data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    getMessages();
  }, [currentChatUser._id, id]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [message]);
  useEffect(() => {
    if (currentChatUser !== "") {
      socket.current = io(serverURL);
      socket.current.emit("addUser", id);
    }
  }, [currentChatUser, id]);
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({
          id: msg.id,
          myself: false,
          message: msg,
        });
      });
    }
  }, [arrivalMessage]);
  useEffect(() => {
    arrivalMessage && setMessage((previous) => [...previous, arrivalMessage]);
  }, [arrivalMessage]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isPickerVisible &&
        !e.target.closest(".emojiPickerContainer") &&
        !e.target.closest("button")
      ) {
        setIsPickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isPickerVisible]);
  const handleEmojiSelect = (emoji) => {
    setInputMessage((prevMessage) => prevMessage + emoji);
  };

  return (
    <div className="mainChatContainer">
      <div>
        <div className="topMsgContainer">
          <img src={currentChatUser?.avatar} className="userProfile" alt="" />
          <p style={{ marginLeft: "10px", marginTop: "10px" }}>
            {currentChatUser?.fullName}
          </p>
        </div>
        <div className="msgContainer">
          {message.map((msg) =>
            msg.myself ? (
              <div key={msg.id} ref={scrollRef}>
                <div className="yourMsg">
                  <div>
                    <p className="msgTxt">{msg?.message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div key={msg.id} ref={scrollRef}>
                <div className="msg">
                  <img
                    src={currentChatUser?.avatar}
                    alt=""
                    className="chatUserProfile"
                  />
                  <div>
                    <p className="msgTxt">{msg?.message}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <Grid container className="msgSenderContainer">
          <Grid item xs={10} md={10}>
            <input
              type="text"
              name=""
              id=""
              placeholder="Write your message to your friend"
              className="msgInput"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Grid>
          <Grid
            item
            xs={1}
            md={1}
            className="emoji"
            style={{
              marginTop: 5,
            }}
            onClick={() => setIsPickerVisible(!isPickerVisible)}
          >
            🙂
          </Grid>
          <div
            className="emojiPickerContainer"
            style={{
              display: isPickerVisible ? "block" : "none",
            }}
          >
            <Picker
              data={dataEmoji}
              onEmojiSelect={(e) => {
                handleEmojiSelect(e.native);
              }}
            />
          </div>
          <Grid item xs={1} md={1} className="sendButton" onClick={sendMessage}>
            <SendOutlined
              style={{
                color: theme === "dark" ? "white" : "black",
              }}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
