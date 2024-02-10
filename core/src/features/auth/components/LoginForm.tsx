import { AtSignIcon, LockIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Checkbox,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Auth, OrderCloudError } from "ordercloud-javascript-sdk";
import { FC, FormEvent, useCallback, useState } from "react";
import { ApiError } from "../../domains/ordercloud/models/ApiError";
import useOrderCloudContext from "../../domains/ordercloud/hooks/useOrderCloudContext";

interface ILoginForm {
  initialFocusRef?: React.RefObject<HTMLInputElement>;
  onLogin: (accessToken: string, refreshToken?: string) => void;
}

const LoginForm: FC<ILoginForm> = ({ initialFocusRef, onLogin }) => {
  const { clientId, scope, customScope } = useOrderCloudContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<ApiError[] | undefined>();
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await Auth.Login(
          username,
          password,
          clientId,
          scope,
          customScope
        );
        setErrors(undefined);
        onLogin(
          response.access_token,
          rememberMe ? response.refresh_token : undefined
        );
      } catch (ex) {
        const errors = (ex as OrderCloudError).errors;
        setErrors(errors);
      } finally {
        setLoading(false);
      }
    },
    [clientId, customScope, onLogin, password, rememberMe, scope, username]
  );

  return (
    <form id="OC_LOGIN_FORM" onSubmit={handleLogin}>
      <FormControl isDisabled={loading} isRequired mb={3}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <AtSignIcon />
          </InputLeftElement>
          <Input
            ref={initialFocusRef}
            aria-label="Username"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <FormControl isDisabled={loading} isRequired mb={3}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <LockIcon />
          </InputLeftElement>
          <Input
            aria-label="Password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <FormControl isDisabled={loading} mb={6}>
        <Checkbox
          isChecked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        >
          Keep me logged in
        </Checkbox>
      </FormControl>
      <Button
        isDisabled={loading || !username || !password}
        w="full"
        type="submit"
        variant="solid"
        colorScheme="blue"
        mb={5}
      >
        Login
      </Button>
      <Button w="full" variant="link" size="xs" mb={6}>
        Forgot username or password?
      </Button>
      {errors?.map((e, i) => (
        <Alert status="error" key={i} mb={5}>
          <AlertIcon />
          <AlertDescription>{e.Message}</AlertDescription>
        </Alert>
      ))}
    </form>
  );
};

export default LoginForm;
