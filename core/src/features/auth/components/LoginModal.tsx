import {
  Box,
  Center,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { FC, useRef } from "react";
import LoginForm from "./LoginForm";
import useOrderCloudContext from "../../domains/ordercloud/hooks/useOrderCloudContext";

interface ILoginModal {
  disclosure: UseDisclosureReturn;
  onLogin: (accessToken: string, refreshToken?: string) => void;
}

const LoginModal: FC<ILoginModal> = ({ disclosure: {onClose, isOpen}, onLogin }) => {
  const {allowAnonymous} = useOrderCloudContext();
  const initialFocusRef = useRef<HTMLInputElement>(null);
  return (
    <Modal
      size={allowAnonymous ? "lg" : "full"}
      onClose={onClose}
      isOpen={isOpen}
      initialFocusRef={initialFocusRef}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        {allowAnonymous && <ModalCloseButton />}
        <ModalBody as={Center}>
          <Box w={allowAnonymous ? "full" : "400px"} maxW="100%" pt={5}>
            <Heading size="md" textAlign="center" mb={10}>
              Login {!allowAnonymous && "Required"}
            </Heading>
            <LoginForm onLogin={onLogin} initialFocusRef={initialFocusRef} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
