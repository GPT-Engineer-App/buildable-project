import { useState } from 'react';
import { Container, Heading, Button, VStack, HStack, Input, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';
import { useVenues, useAddVenue, useUpdateVenue, useDeleteVenue } from '../integrations/supabase/index.js';

const Venues = () => {
  const { data: venues, isLoading, isError } = useVenues();
  const addVenueMutation = useAddVenue();
  const updateVenueMutation = useUpdateVenue();
  const deleteVenueMutation = useDeleteVenue();

  const [newVenue, setNewVenue] = useState({ name: '', capacity: '', type: '' });
  const [editingVenue, setEditingVenue] = useState(null);

  const handleAddVenue = () => {
    addVenueMutation.mutate(newVenue);
    setNewVenue({ name: '', capacity: '', type: '' });
  };

  const handleUpdateVenue = (venue) => {
    updateVenueMutation.mutate(venue);
    setEditingVenue(null);
  };

  const handleDeleteVenue = (id) => {
    deleteVenueMutation.mutate(id);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error loading venues</div>;

  return (
    <Container>
      <Heading as="h1" size="xl" mb={4}>Venues</Heading>
      <VStack spacing={4} mb={8}>
        <HStack>
          <Input placeholder="Name" value={newVenue.name} onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })} />
          <Input placeholder="Capacity" value={newVenue.capacity} onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })} />
          <Input placeholder="Type" value={newVenue.type} onChange={(e) => setNewVenue({ ...newVenue, type: e.target.value })} />
          <Button onClick={handleAddVenue}>Add Venue</Button>
        </HStack>
      </VStack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Capacity</Th>
            <Th>Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {venues.map((venue) => (
            <Tr key={venue.id}>
              <Td>
                {editingVenue?.id === venue.id ? (
                  <Input value={editingVenue.name} onChange={(e) => setEditingVenue({ ...editingVenue, name: e.target.value })} />
                ) : (
                  venue.name
                )}
              </Td>
              <Td>
                {editingVenue?.id === venue.id ? (
                  <Input value={editingVenue.capacity} onChange={(e) => setEditingVenue({ ...editingVenue, capacity: e.target.value })} />
                ) : (
                  venue.capacity
                )}
              </Td>
              <Td>
                {editingVenue?.id === venue.id ? (
                  <Input value={editingVenue.type} onChange={(e) => setEditingVenue({ ...editingVenue, type: e.target.value })} />
                ) : (
                  venue.type
                )}
              </Td>
              <Td>
                {editingVenue?.id === venue.id ? (
                  <Button onClick={() => handleUpdateVenue(editingVenue)}>Save</Button>
                ) : (
                  <Button onClick={() => setEditingVenue(venue)}>Edit</Button>
                )}
                <Button onClick={() => handleDeleteVenue(venue.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Venues;