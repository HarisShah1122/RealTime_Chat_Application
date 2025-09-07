import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Box, Button, Stack, Text, useMediaQuery, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import GroupChatModal from "./GroupChatModal";
import { api } from "../utils/api";
import chatsData from "../data/chatsData";
import { getSender } from "../config/ChatLogics";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [isVerySmallScreen] = useMediaQuery("(max-width: 300px)");
  const [isSmallScreen] = useMediaQuery("(max-width: 405px)");
  const [isMediumScreen] = useMediaQuery("(min-width: 700px) and (max-width:980px)");
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chat");
      setChats(data);
    } catch (error) {
      toast({
        title: "Using Local Chat Data",
        description: "Failed to fetch from API, using demo data",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setChats(chatsData);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: isMediumScreen ? "40%" : "31%" }}
      borderRadius="lg"
      borderWidth="2px"
      boxShadow="0 0 10px #020161f1"
      h="100vh"
    >
      {/* Header */}
      <Box
        pb={3}
        px={2}
        fontSize={
          isSmallScreen
            ? isVerySmallScreen
              ? "15px"
              : "20px"
            : isMediumScreen
            ? "25px"
            : "30px"
        }
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={isVerySmallScreen ? "12px" : "15px"}
            rightIcon={<AddIcon />}
            bg="green.600"
            color="white"
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      {/* Chats List */}
      <Box
        display="flex"
        flexDir="column"
        p={2}
        bg="#F8F8F8"
        w="100%"
        flex="1"
        borderRadius="lg"
        overflowY="auto"
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {chats ? (
          <Stack spacing={2}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text fontWeight="normal">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text
                    fontSize="xs"
                    whiteSpace="pre-line"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {chat.latestMessage.content
                      .replace(/<br>/g, "\n")
                      .split("\n")[0]
                      .substring(0, 51)}
                    {chat.latestMessage.content.length > 50 && " ..."}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>Loading chats...</Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
