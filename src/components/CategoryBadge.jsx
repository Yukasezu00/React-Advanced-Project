import React from "react";
import { Badge } from "@chakra-ui/react";

const CategoryBadge = ({ label }) => {
  return (
    <Badge
      colorScheme="teal"
      px={2}
      py={1}
      borderRadius="md"
      color="white"
      bg="teal.500"
    >
      {label.toUpperCase()}
    </Badge>
  );
};

export default CategoryBadge;
