import { Box, Button, ButtonProps } from "@chakra-ui/react";
import { FC, PropsWithChildren, forwardRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavButtonProps extends PropsWithChildren<ButtonProps> {
  to: string;
}

const NavButton = forwardRef<ButtonProps, NavButtonProps>(
  ({ to, ...props }, ref) => {
    const { pathname } = useLocation();
    const isActive = useMemo(() => {
      return pathname === to;
    }, [pathname, to]);
    return (
      <Button
        isActive={isActive}
        ref={ref}
        as={Link}
        w="full"
        to={to}
        {...props}
        colorScheme={isActive ? props.colorScheme : ''}
      />
    );
  }
);

const Navigation: FC = () => {
  return (
    <Box as="nav" p={3}>
      <NavButton
        to="/"
        variant="ghost"
        colorScheme="blue"
        justifyContent="start"
      >
        Home
      </NavButton>
      <NavButton
        to="/orders"
        variant="ghost"
        colorScheme="purple"
        justifyContent="start"
      >
        Orders
      </NavButton>
    </Box>
  );
};

export default Navigation;
