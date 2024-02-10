import { Container, Heading, Text } from "@chakra-ui/react";
import { OrderDirection } from "ordercloud-javascript-sdk";
import { FC } from "react";
import useOrders, { OrderListOptions } from "../hooks/useOrders";
import DataTable from "./DataTable";

interface IOrders {
  direction: OrderDirection;
  listOptions?: OrderListOptions;
}

const Orders: FC<IOrders> = ({ direction, listOptions }) => {
  const dataQuery = useOrders(direction, listOptions);
  return (
    <Container maxW="full" pt={6} px={8}>
      <Heading size="lg">Orders</Heading>
      <Text>Direction: {direction}</Text>
      <Text>List Options:</Text>
      <pre>{JSON.stringify(listOptions, null, 2)}</pre>
      <Heading size="md">Response</Heading>
      <DataTable query={dataQuery} />
    </Container>
  );
};

export default Orders;
