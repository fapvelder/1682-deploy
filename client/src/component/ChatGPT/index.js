import React, { useState, useEffect, useRef } from "react";
import "./chatGPT.css";
import logo from "../img/logo-icon.png";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { sendMessageChatGPT } from "../../api";
import { ThreeDots } from "react-loader-spinner";
import handleLoading from "../HandleLoading";
import useLoading from "../HandleLoading/useLoading";
import { Grid } from "@material-ui/core";

function ChatGPT() {
  const { loading, setLoading, reload, setReload } = useLoading();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatWindowRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const theme = localStorage.getItem("theme");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    if (inputValue.length > 0) {
      const userMessage = { role: "user", content: inputValue };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue("");
      handleLoading(
        async () => {
          const result = await sendMessageChatGPT(inputValue);
          const botMessage = {
            role: "assistant",
            content: result.data.content,
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
          saveMessages([...messages, userMessage, botMessage]); // Save messages to localStorage
        },
        setLoading,
        setReload
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleFormSubmit();
    }
  };

  const toggleChatWindow = () => {
    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen);
  };

  useEffect(() => {
    // Scroll chat history to the bottom when new messages are added
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Load messages from localStorage when the component mounts
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages"));
    if (savedMessages) {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    // Reset chat history scroll position when chat window is toggled
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [isChatOpen]);

  const saveMessages = (messages) => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  };

  return (
    <div
      className="chatgpt-container"
      onClick={() => !isChatOpen && toggleChatWindow()}
    >
      <div
        className={`chat-window rounded border ${
          isChatOpen ? "open" : "closed"
        }`}
        style={{ height: 600, width: 350, padding: 10 }}
        ref={chatWindowRef}
      >
        <div
          className="chat-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 10,
            cursor: "pointer",
          }}
        >
          <div>
            {!isChatOpen ? "Chat with GameBay Chat Bot" : "GameBay Chatbot"}
          </div>
          {isChatOpen && (
            <div onClick={() => toggleChatWindow()}>
              <CloseCircleOutlined
                style={{ fontSize: "24px", marginLeft: 50 }}
              />
            </div>
          )}
        </div>
        <div
          className="chat-history border"
          style={{ height: "85%", padding: 10 }}
          ref={chatHistoryRef}
        >
          <div className={`message assistant`}>
            <div style={{ color: "gray" }} className="message-content">
              Please tell me if you have any problem
            </div>
          </div>
          {messages.map((message, index) => (
            <Grid
              container
              key={index}
              className={`message text-start ${
                message.role === "user" ? "user" : "assistant"
              }`}
            >
              {message.role === "assistant" && (
                <Grid container>
                  <img
                    src={logo}
                    style={{ width: 35, height: 35, borderRadius: "50%" }}
                    alt="chatbot"
                  />
                  <p style={{ lineHeight: 2, marginLeft: 10, color: "orange" }}>
                    GameBay Bot
                  </p>
                </Grid>
              )}
              <div className="message-content">
                {message?.role === "assistant" ? (
                  <div>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: message?.content?.replace(/\n/g, "<br>"),
                      }}
                      style={{ color: "gray" }}
                    />
                  </div>
                ) : (
                  message?.content
                )}
              </div>
            </Grid>
          ))}
          {loading && (
            <div style={{ background: "transparent" }}>
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color={theme === "light" ? "black" : "white"}
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            </div>
          )}
        </div>
        <div className="chat-input-form mt-15">
          <div className="inputGroup">
            <Input
              className="customInputAntd"
              type="text"
              style={{ width: "85%" }}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />
            <div className="inputGroupAppend">
              <button onClick={handleFormSubmit} type="submit">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGPT;
