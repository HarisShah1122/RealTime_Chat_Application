import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ChatState } from "../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserAvatar/UserListItem";
import { getSender } from "../config/ChatLogics";
import "./styles.css";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isSmallScreen] = useMediaQuery("(max-width: 576px)");
  const [isVerySmallScreen] = useMediaQuery("(max-width: 405px)");

  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async (query) => {
    if (!query) return setSearchResult([]);

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching chat",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    handleSearch(search);
  }, [search]);

  return (
    <>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center"
        bg="white" w="98.9%" ml="10px" mr="10px" p="4px 0" borderRadius="lg" borderWidth="2px" mt={2} boxShadow="0 0 5px #020161f1">
        <Box display="flex">
          <Tooltip label="Search Users" hasArrow placement="bottom-end">
            <Button
              variant="ghost"
              borderRadius="2xl"
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              borderLeftRadius={0}
              bg="#020161f1"
              onClick={onOpen}
            >
              <FontAwesomeIcon icon={faSearch} style={{ color: "white" }} />
              <Text display={isSmallScreen ? "none" : "flex"} px={isSmallScreen ? "5%" : "12%"} color="white">
                Search User
              </Text>
            </Button>
          </Tooltip>
        </Box>

        <Text fontFamily="Libre Baskerville" fontSize={isSmallScreen ? (isVerySmallScreen ? "10px" : "14px") : "25px"} fontWeight="bold">
          Chat-Stream
        </Text>

        <Box display="flex" alignItems="center">
          {/* Notifications */}
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton as={Button} p={1} m={1} isActive={isOpen} style={{ background: "transparent" }}>
                  <div>{notification.length > 0 && <div className="notification-badge"><span className="badge">{notification.length}</span></div>}</div>
                  <BellIcon boxSize={6} color="blue.700" />
                </MenuButton>
                <MenuList pl={2}>
                  {!notification.length && "No new message"}
                  {notification.map((notify) => (
                    <MenuItem key={notify._id} onClick={() => { setSelectedChat(notify.chat); setNotification(notification.filter(n => n !== notify)); }}>
                      {notify.chat.isGroupChat ? `New message in ${notify.chat.chatName}` : `New message from ${getSender(user, notify.chat.users)}`}
                    </MenuItem>
                  ))}
                </MenuList>
              </>
            )}
          </Menu>

          {/* User Menu */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} style={{ background: "transparent" }}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.photo} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}><MenuItem>My Profile</MenuItem></ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      {/* Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" display="flex" alignItems="center">
            <IconButton icon={<ArrowBackIcon />} onClick={onClose} bg="transparent" variant="ghost" color="blue.700" mr={1} />
            Search Users
          </DrawerHeader>
          <DrawerBody display="flex" flexDir="column" p={2} overflowY="auto" maxH="80vh">
            <Box display="flex" borderRadius="2xl" borderWidth={2} borderColor="blackAlpha.400" p={0} mb={2}>
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                borderRightRadius={0}
                borderLeftRadius="2xl"
                p={0}
                pl="5%"
                _focus={{ borderColor: "transparent", boxShadow: "0 0 10px #020161f1" }}
              />
              <Button bg="#020161f1" onClick={() => handleSearch(search)} borderTopLeftRadius={0} borderBottomLeftRadius={0} borderRightRadius="2xl" p={0}>
                <FontAwesomeIcon icon={faSearch} style={{ color: "white" }} />
              </Button>
            </Box>

            {loading ? <ChatLoading /> : searchResult?.map(user => (
              <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
            ))}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
