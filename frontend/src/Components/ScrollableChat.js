import React, { useEffect, useRef } from "react";
import { ChatState } from "../context/chatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import mockMessages from "../data/mockMessages";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const displayMessages = messages && messages.length > 0 ? messages : mockMessages;
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto", // scrolling enabled
        paddingRight: "10px",
      }}
      className="scrollable-chat"
    >
      {displayMessages.map((m, i) => (
        <div
          key={m._id}
          style={{ display: "flex", whiteSpace: "pre-wrap" }}
          ref={scrollRef}
        >
          {(isSameSender(displayMessages, m, i, user._id) ||
            isLastMessage(displayMessages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
              />
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: m.sender._id === user._id ? "#cef8af" : "white",
              marginLeft: isSameSenderMargin(displayMessages, m, i, user._id),
              marginRight: 2,
              marginTop: isSameUser(displayMessages, m, i, user._id) ? 3 : 10,
              borderRadius: `10px ${m.sender._id === user._id ? "0px" : "10px"} 10px ${m.sender._id === user._id ? "10px" : "0px"}`,
              padding: "5px 15px",
              maxWidth: "75%",
            }}
            dangerouslySetInnerHTML={{ __html: m.content }}
          ></span>
        </div>
      ))}
    </div>
  );
};

export default ScrollableChat;
