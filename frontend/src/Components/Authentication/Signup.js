import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
  HStack,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { AttachmentIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [isSmallScreen] = useMediaQuery("(max-width: 400px)");
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  // ✅ Upload image to Cloudinary
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFileName(file.name);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
    data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

    fetch(process.env.REACT_APP_IMAGE_API, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPhoto(data.url.toString());
      })
      .catch(() => {
        toast({
          title: "Image upload failed",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      });
  };

  // ✅ Submit signup data to backend
  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-Type": "application/json" } };

      // ✅ call your backend endpoint
      const { data } = await axios.post(
        "http://localhost:8081/api/user",
        { name, email, password, photo }, 
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      toast({
        title: "Registration successful",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });

      setTimeout(() => {
        setLoading(false);
        history.push("/chat"); 
      }, 1000);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Signup failed",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="4px">
      {/* Name */}
      <FormControl id="name" isRequired mb="3" borderColor="black">
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      {/* Email */}
      <FormControl id="email" isRequired mb="3" borderColor="black">
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      {/* Password */}
      <FormControl id="password" isRequired mb="3" borderColor="black">
        <FormLabel>Password</FormLabel>
        <InputGroup borderColor="black">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label={show ? "Hide Password" : "Show Password"}
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
              onClick={handleClick}
              bg="transparent"
              _hover={{ boxShadow: "none", transition: "none" }}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Confirm Password */}
      <FormControl id="confirm-password" isRequired mb="3" borderColor="black">
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          placeholder="Confirm your password"
          value={confirmpassword}
          onChange={(e) => setConfirmpassword(e.target.value)}
        />
      </FormControl>

      {/* Upload Profile Photo */}
      <FormLabel alignSelf="start">Upload Profile Photo</FormLabel>
      <FormControl
        id="pic"
        mb="3"
        borderColor="black"
        borderWidth="1px"
        borderRadius="md"
        p="3"
      >
        <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <HStack spacing="2" alignItems="center">
            <AttachmentIcon />
          </HStack>
        </label>
        {selectedFileName && (
          <Text fontSize="sm" color="black">
            {selectedFileName}
          </Text>
        )}
      </FormControl>

      {/* Submit Button */}
      <Button
        bg="black"
        color="white"
        _hover={{ boxShadow: "none", transition: "none" }}
        onClick={submitHandler}
        isLoading={loading}
        fontSize={isSmallScreen ? "15px" : "18px"}
        width={isSmallScreen ? "85%" : "70%"}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
