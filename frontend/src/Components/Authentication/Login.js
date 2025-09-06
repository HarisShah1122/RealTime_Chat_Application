import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const [isSmallScreen] = useMediaQuery("(max-width: 400px)");

  const handleClick = () => setShow(!show);

  const submitHandler = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    if (!email || !password) {
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

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.post(
        "http://localhost:8081/api/user/login",
        { email, password },
        config
      );

      // ✅ Store backend response (name, email, photo, token)
      localStorage.setItem("userInfo", JSON.stringify(data));

      toast({
        title: "Login successful",
        status: "success",
        duration: 1500,
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
        description:
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <VStack spacing="4px">
        <FormControl id="login-email" isRequired mb="3" borderColor="black">
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="login-password" isRequired mb="3" borderColor="black">
          <FormLabel>Password</FormLabel>
          <InputGroup borderColor="black">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter your password"
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

        <Button
          type="submit"
          mb="2"
          bg="#45458e"
          color="white"
          _hover={{ boxShadow: "none", transition: "none" }}
          isLoading={loading}
          fontSize={isSmallScreen ? "16px" : "18px"}
          width={isSmallScreen ? "85%" : "70%"}
        >
          Login
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
