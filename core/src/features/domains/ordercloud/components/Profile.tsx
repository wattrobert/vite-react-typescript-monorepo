import { FC } from "react";
import { useCurrentUser, useMutateCurrentUser } from "../hooks/currentUser";
import { Box, Button, Center, Container, Heading, Skeleton } from "@chakra-ui/react";
import useOrderCloudContext from "../hooks/useOrderCloudContext";
import { WarningIcon } from "@chakra-ui/icons";

const Profile: FC = () => {
  const {isLoggedIn} = useOrderCloudContext();
  const { data: user, isError, isPending:isLoading } = useCurrentUser();
  const {mutate, isPending} = useMutateCurrentUser();

  return <Container maxW="full" pt={6} px={8}>
    <Skeleton isLoaded={!isLoading}>
      {isError ? (
        <Box as={Center}><Heading><WarningIcon/></Heading></Box>
      ) : isLoggedIn ? (
          <>
            <Heading size="md" mb={5}>{`Welcome ${user?.FirstName} ${user?.LastName}!`}</Heading>
            <Button isDisabled={isPending} onClick={() => mutate({FirstName: "Buyer", LastName: "User"})}>Change Name</Button>
          </>
        ) : (
          <>
            <Heading size="md">Welcome to the app!</Heading>
          </>
        )}
    </Skeleton>
  </Container>
};

export default Profile;
