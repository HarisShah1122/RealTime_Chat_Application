import React, { useState } from "react";
import { ChatState } from "../context/chatProvider.js";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/SideDrawer.js";
import ChatBox from "../Components/ChatBox.js";
import MyChats from "../Components/MyChats.js";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%", overflowY: "hidden", height: "100vh" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="92%"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
