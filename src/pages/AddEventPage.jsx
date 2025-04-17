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
import Select from "react-select";
import { useCategories } from "../contexts/CategoriesContext";
import { useUsers } from "../contexts/UsersContext";

const customStyles = {
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#319795",
    color: "white",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "white",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "white",
    ":hover": {
      backgroundColor: "#2C7A7B",
      color: "white",
    },
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? "#EDF2F7" : "white",
    color: "black",
  }),
};

export const AddEventPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const categories = useCategories();
  const users = useUsers();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
    createdBy: null,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const hasChanges = Object.values(formData).some((v) =>
      Array.isArray(v) ? v.length > 0 : v !== ""
    );
    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    const ids = selectedOptions.map((opt) => opt.value);
    setFormData((prev) => ({
      ...prev,
      categoryIds: ids,
    }));
  };

  const handleCreatorChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      createdBy: selectedOption ? selectedOption.value : null,
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

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (end < start) {
      toast({
        title: "Invalid dates",
        description: "End time cannot be before start time.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const newEvent = { ...formData };

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

        <FormControl mb={4}>
          <FormLabel>Categories</FormLabel>
          <Select
            isMulti
            styles={customStyles}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            onChange={handleCategoryChange}
            value={categories
              .filter((cat) => formData.categoryIds.includes(cat.id))
              .map((cat) => ({ value: cat.id, label: cat.name }))}
          />
        </FormControl>

        <FormControl mb={6} isRequired>
          <FormLabel>Created By</FormLabel>
          <Select
            styles={customStyles}
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            onChange={handleCreatorChange}
            value={users
              .filter((user) => user.id === formData.createdBy)
              .map((user) => ({ value: user.id, label: user.name }))}
          />
        </FormControl>

        <Button type="submit" colorScheme="teal">
          Submit
        </Button>
      </form>

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
