import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { OrderCloudContext } from "../../domains/ordercloud/context";

const AuthToggle = () => {
  const { logout, login, isLoggedIn } = useContext(OrderCloudContext);
  return (
    <Button variant={isLoggedIn ? 'ghost' : 'solid'} colorScheme={isLoggedIn ? 'gray' : 'blue'} onClick={isLoggedIn ? logout : login}>
      {isLoggedIn ? 'Logout' : 'Login'}
    </Button>
  );
};

export default AuthToggle;
