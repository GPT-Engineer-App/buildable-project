import { useState } from 'react';
import { Container, Heading, Button, VStack, HStack, Input, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../integrations/supabase/index.js';

const Events = () => {
  const { data: events, isLoading, isError } = useEvents();
  const addEventMutation = useAddEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const [newEvent, setNewEvent] = useState({ name: '', date: '', venue: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddEvent = () => {
    addEventMutation.mutate(newEvent);
    setNewEvent({ name: '', date: '', venue: '' });
  };

  const handleUpdateEvent = (event) => {
    updateEventMutation.mutate(event);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    deleteEventMutation.mutate(id);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error loading events</div>;

  return (
    <Container>
      <Heading as="h1" size="xl" mb={4}>Events</Heading>
      <VStack spacing={4} mb={8}>
        <HStack>
          <Input placeholder="Name" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} />
          <Input placeholder="Date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
          <Input placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} />
          <Button onClick={handleAddEvent}>Add Event</Button>
        </HStack>
      </VStack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Date</Th>
            <Th>Venue</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map((event) => (
            <Tr key={event.id}>
              <Td>
                {editingEvent?.id === event.id ? (
                  <Input value={editingEvent.name} onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })} />
                ) : (
                  event.name
                )}
              </Td>
              <Td>
                {editingEvent?.id === event.id ? (
                  <Input value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                ) : (
                  event.date
                )}
              </Td>
              <Td>
                {editingEvent?.id === event.id ? (
                  <Input value={editingEvent.venue} onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })} />
                ) : (
                  event.venue
                )}
              </Td>
              <Td>
                {editingEvent?.id === event.id ? (
                  <Button onClick={() => handleUpdateEvent(editingEvent)}>Save</Button>
                ) : (
                  <Button onClick={() => setEditingEvent(event)}>Edit</Button>
                )}
                <Button onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Events;