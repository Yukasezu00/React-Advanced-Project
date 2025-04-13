import React from "react";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  Container,
} from "@chakra-ui/react";

export const Root = () => {
  const location = useLocation();

  // Verberg Add Event knop op /add en /event/[id] pagina's
  const hideAddButton =
    location.pathname === "/add" || location.pathname.startsWith("/event/");

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Top navigatie */}
      <Box bg="white" boxShadow="sm" py={3} px={5}>
        <Flex align="center" maxW="4xl" mx="auto">
          <Heading size="sm">
            <RouterLink to="/">Event Manager</RouterLink>
          </Heading>
          <Spacer />
          {!hideAddButton && (
            <Button
              as={RouterLink}
              to="/add"
              colorScheme="teal"
              variant="solid"
              size="sm"
            >
              Add Event
            </Button>
          )}
        </Flex>
      </Box>

      {/* Pagina-inhoud */}
      <Container maxW="4xl" py={4}>
        <Outlet />
      </Container>
    </Box>
  );
};
