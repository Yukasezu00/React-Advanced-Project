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

export const EditEventModal = ({ isOpen, onClose, event, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryIds, setCategoryIds] = useState("");

  const toast = useToast();
  const cancelRef = useRef();

  const [originalEvent, setOriginalEvent] = useState(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  useEffect(() => {
    if (event) {
      const original = {
        title: event.title || "",
        description: event.description || "",
        image: event.image || "",
        startTime: event.startTime?.slice(0, 16) || "",
        endTime: event.endTime?.slice(0, 16) || "",
        categoryIds: event.categoryIds?.join(", ") || "",
      };
      setOriginalEvent(original);
      setTitle(original.title);
      setDescription(original.description);
      setImage(original.image);
      setStartTime(original.startTime);
      setEndTime(original.endTime);
      setCategoryIds(original.categoryIds);
    }
  }, [event]);

  const hasUnsavedChanges =
    title !== originalEvent?.title ||
    description !== originalEvent?.description ||
    image !== originalEvent?.image ||
    startTime !== originalEvent?.startTime ||
    endTime !== originalEvent?.endTime ||
    categoryIds !== originalEvent?.categoryIds;

  const resetForm = () => {
    if (originalEvent) {
      setTitle(originalEvent.title);
      setDescription(originalEvent.description);
      setImage(originalEvent.image);
      setStartTime(originalEvent.startTime);
      setEndTime(originalEvent.endTime);
      setCategoryIds(originalEvent.categoryIds);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowDiscardDialog(true);
    } else {
      onClose();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardDialog(false);
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!hasUnsavedChanges) {
      onClose(); // gewoon sluiten zonder iets te doen
      return;
    }

    const updatedEvent = {
      ...event,
      title,
      description,
      image,
      startTime,
      endTime,
      categoryIds: categoryIds
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id)),
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
        onUpdate(data); // toast in EventPage.jsx
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
      console.error("Update failed:", error);
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
              <FormLabel>Category IDs (comma separated)</FormLabel>
              <Input
                value={categoryIds}
                onChange={(e) => setCategoryIds(e.target.value)}
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

      {/* Confirm discard modal */}
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
