import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Image,
  Badge,
  Button,
  Flex,
  Input,
  HStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useCategories } from "../contexts/CategoriesContext";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const categories = useCategories();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:3000/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryId === null ||
      event.categoryIds.includes(Number(selectedCategoryId));

    return matchesSearch && matchesCategory;
  });

  return (
    <Box p={6} bg="gray.50">
      <Heading size="lg" mb={6}>
        List of events
      </Heading>

      <Input
        placeholder="Search events by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={6}
        size="lg"
        borderColor="gray.300"
      />

      <HStack spacing={2} mb={6}>
        <Button
          onClick={() => setSelectedCategoryId(null)}
          colorScheme={selectedCategoryId === null ? "teal" : "gray"}
          size="lg"
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => setSelectedCategoryId(Number(cat.id))}
            colorScheme={
              Number(selectedCategoryId) === Number(cat.id) ? "teal" : "gray"
            }
            size="lg"
          >
            {cat.name}
          </Button>
        ))}
      </HStack>

      {filteredEvents.length === 0 ? (
        <Text mt={4} fontStyle="italic" color="gray.500">
          No events found.
        </Text>
      ) : (
        <VStack spacing={8} align="stretch">
          {filteredEvents.map((event) => (
            <Box
              as={RouterLink}
              to={`/event/${event.id}`}
              key={event.id}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              _hover={{ bg: "gray.50", cursor: "pointer" }}
              boxShadow="md"
              bg="white"
            >
              <Flex direction={{ base: "column", md: "row" }}>
                <Image
                  src={event.image}
                  alt={event.title}
                  boxSize="120px"
                  objectFit="cover"
                  borderRadius="md"
                  mb={{ base: 4, md: 0 }}
                />
                <Box ml={{ base: 0, md: 6 }}>
                  <Heading size="md" mb={4}>
                    {event.title}
                  </Heading>
                  <Text mb={4}>{event.description}</Text>
                  <Text mb={4} fontSize="sm" color="gray.600">
                    Start: {new Date(event.startTime).toLocaleString()}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    End: {new Date(event.endTime).toLocaleString()}
                  </Text>
                  <Box mt={2}>
                    {event.categoryIds?.map((id) => {
                      const category = categories.find(
                        (c) => Number(c.id) === Number(id)
                      );
                      return (
                        <Badge key={id} colorScheme="teal" mr={2}>
                          {category ? category.name : `Category ${id}`}
                        </Badge>
                      );
                    })}
                  </Box>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};
