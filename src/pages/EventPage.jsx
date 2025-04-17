import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Image,
  Spinner,
  Badge,
  Avatar,
  Flex,
  Button,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useCategories } from "../contexts/CategoriesContext";
import { useUsers } from "../contexts/UsersContext";
import { EditEventModal } from "../components/EditEventModal";

export const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // voor delete-confirm modal
  const categories = useCategories();
  const users = useUsers();
  const toast = useToast();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/events/${eventId}`);
        const eventData = await res.json();
        setEvent(eventData);
      } catch (err) {
        console.error("Error loading event:", err);
      }
    };

    fetchEventData();
  }, [eventId]);

  if (!event) {
    return (
      <Box p={6}>
        <Spinner />
      </Box>
    );
  }

  const creator = users.find((u) => Number(u.id) === Number(event.createdBy));

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event");

      navigate("/");
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <Box maxW="700px" mx="auto" p={6}>
      <Button
        onClick={() => navigate("/")}
        colorScheme="teal"
        variant="solid"
        mb={4}
      >
        ← Back to events
      </Button>

      <Heading mb={4}>{event.title}</Heading>

      <Image
        src={event.image}
        alt={event.title}
        borderRadius="md"
        maxW="100%"
        maxH="180px"
        objectFit="cover"
        mb={4}
      />

      <Text fontSize="lg" mb={4}>
        {event.description}
      </Text>

      <Text fontSize="sm" color="gray.600">
        <strong>Start:</strong> {formatDateTime(event.startTime)}
      </Text>
      <Text fontSize="sm" color="gray.600" mb={2}>
        <strong>End:</strong> {formatDateTime(event.endTime)}
      </Text>

      <Box mt={2} mb={4}>
        {event.categoryIds?.map((id) => {
          const category = categories.find((c) => Number(c.id) === Number(id));
          return (
            <Badge key={id} colorScheme="teal" mr={2}>
              {category ? category.name : `Category ${id}`}
            </Badge>
          );
        })}
      </Box>

      {creator && (
        <Flex align="center" mt={4} mb={4}>
          <Avatar src={creator.image} name={creator.name} mr={3} />
          <Text fontWeight="medium">Created by {creator.name}</Text>
        </Flex>
      )}

      <Flex gap={4}>
        <Button colorScheme="teal" onClick={() => setIsEditOpen(true)}>
          Edit Event
        </Button>
        <Button colorScheme="red" onClick={onOpen}>
          Delete Event
        </Button>
      </Flex>

      {/* Edit Modal */}
      <EditEventModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        event={event}
        onUpdate={(updatedEvent) => {
          setEvent(updatedEvent); // <-- update direct de view!
          toast({
            title: "Event updated.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }}
      />

      {/* Confirm Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Event?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Yes, delete it
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
