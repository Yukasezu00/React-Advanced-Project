import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

export const AddEventPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: "",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Detecteer onopgeslagen wijzigingen
  useEffect(() => {
    const hasChanges = Object.values(formData).some((v) => v !== "");
    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      onOpen();
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      ...formData,
      categoryIds: formData.categoryIds
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => !isNaN(id)),
      createdBy: 1,
    };

    try {
      const res = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) throw new Error("Failed to add event");

      toast({
        title: "Event added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="700px" mx="auto" p={6}>
      <Button
        onClick={handleBackClick}
        colorScheme="teal"
        leftIcon={<ArrowBackIcon />}
        variant="solid"
        mb={4}
      >
        Back to events
      </Button>

      <Heading mb={6}>Add a new event</Heading>

      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Image URL</FormLabel>
          <Input
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Start Time</FormLabel>
          <Input
            name="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>End Time</FormLabel>
          <Input
            name="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl mb={6}>
          <FormLabel>Category IDs (comma separated)</FormLabel>
          <Input
            name="categoryIds"
            value={formData.categoryIds}
            onChange={handleInputChange}
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" w="auto">
          Submit
        </Button>
      </form>

      {/* Chakra UI Modal voor terug-navigatie */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave page?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            You have unsaved changes. Are you sure you want to leave this page?
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onClose();
                navigate("/");
              }}
            >
              Leave page
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
