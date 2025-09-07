import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import { ChatState } from "../context/chatProvider";
import { useMediaQuery } from "@chakra-ui/react";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const [isMediumScreen] = useMediaQuery("(min-width: 700px) and (max-width:980px)");

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: isMediumScreen ? "59%" : "68%" }}
      borderRadius="lg"
      borderWidth="2px"
      boxShadow="0 0 10px #020161f1"
      h="100vh"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
