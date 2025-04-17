import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import Select from "react-select";
import { useCategories } from "../contexts/CategoriesContext";
import { useUsers } from "../contexts/UsersContext";

export const EditEventModal = ({ isOpen, onClose, event, onUpdate }) => {
  const categories = useCategories();
  const users = useUsers();
  const toast = useToast();
  const cancelRef = useRef();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [originalEvent, setOriginalEvent] = useState(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#319795",
      boxShadow: "none",
      "&:hover": { borderColor: "#38B2AC" },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#319795",
      color: "white",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      ":hover": {
        backgroundColor: "#2C7A7B",
        color: "white",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#EDF2F7" : "white",
      color: "black",
    }),
  };

  useEffect(() => {
    if (event) {
      const original = {
        title: event.title || "",
        description: event.description || "",
        image: event.image || "",
        startTime: event.startTime?.slice(0, 16) || "",
        endTime: event.endTime?.slice(0, 16) || "",
        selectedCategories:
          event.categoryIds
            ?.map((id) => {
              const cat = categories.find((c) => c.id === id);
              return cat ? { value: cat.id, label: cat.name } : null;
            })
            .filter(Boolean) || [],
        selectedCreator: users.find((u) => u.id === event.createdBy) || null,
      };
      setOriginalEvent(original);
      setTitle(original.title);
      setDescription(original.description);
      setImage(original.image);
      setStartTime(original.startTime);
      setEndTime(original.endTime);
      setSelectedCategories(original.selectedCategories);
      setSelectedCreator(
        original.selectedCreator
          ? {
              value: original.selectedCreator.id,
              label: original.selectedCreator.name,
            }
          : null
      );
    }
  }, [event, categories, users]);

  const hasUnsavedChanges =
    title !== originalEvent?.title ||
    description !== originalEvent?.description ||
    image !== originalEvent?.image ||
    startTime !== originalEvent?.startTime ||
    endTime !== originalEvent?.endTime ||
    JSON.stringify(selectedCategories) !==
      JSON.stringify(originalEvent?.selectedCategories) ||
    JSON.stringify(selectedCreator) !==
      JSON.stringify(originalEvent?.selectedCreator);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowDiscardDialog(true);
    } else {
      onClose();
    }
  };

  const resetForm = () => {
    if (originalEvent) {
      setTitle(originalEvent.title);
      setDescription(originalEvent.description);
      setImage(originalEvent.image);
      setStartTime(originalEvent.startTime);
      setEndTime(originalEvent.endTime);
      setSelectedCategories(originalEvent.selectedCategories);
      setSelectedCreator(
        originalEvent.selectedCreator
          ? {
              value: originalEvent.selectedCreator.id,
              label: originalEvent.selectedCreator.name,
            }
          : null
      );
    }
  };

  const confirmDiscard = () => {
    setShowDiscardDialog(false);
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    const start = new Date(startTime);
    const end = new Date(endTime);

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

    const updatedEvent = {
      ...event,
      title,
      description,
      image,
      startTime,
      endTime,
      categoryIds: selectedCategories.map((c) => c.value),
      createdBy: selectedCreator?.value,
    };

    try {
      const res = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });

      if (!res.ok) throw new Error("Failed to update event");

      const data = await res.json();

      if (onUpdate) {
        onUpdate(data);
      } else {
        toast({
          title: "Event updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Update failed.",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Image URL</FormLabel>
              <Input value={image} onChange={(e) => setImage(e.target.value)} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Categories</FormLabel>
              <Select
                isMulti
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                value={selectedCategories}
                onChange={setSelectedCategories}
                styles={customStyles}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Creator</FormLabel>
              <Select
                options={users.map((u) => ({ value: u.id, label: u.name }))}
                value={selectedCreator}
                onChange={setSelectedCreator}
                styles={customStyles}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              Save Changes
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={showDiscardDialog}
        leastDestructiveRef={cancelRef}
        onClose={() => setShowDiscardDialog(false)}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Discard Changes?
          </AlertDialogHeader>
          <AlertDialogBody>
            You have unsaved changes. Are you sure you want to discard them?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setShowDiscardDialog(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDiscard} ml={3}>
              Discard
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
