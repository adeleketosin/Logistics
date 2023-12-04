import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

// const Container = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin: 2em;
// `;

const QueueContainer = styled.div`
  flex-grow: 1;
  margin-right: 2em;
`;

const PlannerContainer = styled.div`
  flex-grow: 2;
`;

const PlannerTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const PlannerCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const DATASET = {
  customers: [
    { id: 'customer-1', name: 'Customer A', pickup: 'Location A', dropoff: 'Location B' },
    { id: 'customer-2', name: 'Customer B', pickup: 'Location C', dropoff: 'Location D' },
  ],
  planner: {
    slots: ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4'],
    days: 7,
    schedule: {},
  },
};

function App() {
  const [dataset] = useState(() => {
    const savedDataset = localStorage.getItem('logistics-dataset');
    const initialValue = JSON.parse(savedDataset);
    return initialValue || DATASET;
  });

  useEffect(() => {
    localStorage.setItem('logistics-dataset', JSON.stringify(dataset));
  }, [dataset]);

  const onDragEnd = (result) => {
    // Your existing onDragEnd logic
  };

  return (
    <div className='container'>
      <QueueContainer>
        <Droppable droppableId="queue" type="customer">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <h2>Logistics Queue</h2>
              {dataset.customers.map((customer, index) => (
                <Draggable key={customer.id} draggableId={customer.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <CustomerCard customer={customer} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </QueueContainer>

      <PlannerContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          {[...Array(dataset.planner.days)].map((_, dayIndex) => (
            <Droppable key={dayIndex} droppableId={`${dayIndex}`} direction="horizontal" type="customer">
              {(provided) => (
                <PlannerTable {...provided.droppableProps} ref={provided.innerRef}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      {dataset.planner.slots.map((slot) => (
                        <th key={slot}>{slot}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <PlannerRow key={dayIndex} dayIndex={dayIndex} dataset={dataset} />
                  </tbody>
                </PlannerTable>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </PlannerContainer>
    </div>
  );
}

const PlannerRow = ({ dayIndex, dataset }) => {
  const day = new Date();
  day.setDate(day.getDate() + dayIndex);

  return (
    <tr>
      <PlannerCell>{day.toDateString()}</PlannerCell>
      {dataset.planner.slots.map((slot, slotIndex) => (
        <PlannerCell key={slotIndex}>
          <Droppable droppableId={`${dayIndex}`} type="customer">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {dataset.planner.schedule[dayIndex]?.[slotIndex] && (
                  <CustomerCard
                    customer={dataset.customers.find(
                      (c) => c.id === dataset.planner.schedule[dayIndex][slotIndex]
                    )}
                  />
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </PlannerCell>
      ))}
    </tr>
  );
};

const CustomerCard = ({ customer }) => (
  <div style={{ border: '1px solid #ddd', padding: '8px', marginBottom: '8px' }}>
    <strong>{customer.name}</strong>
    <p>Pick Up: {customer.pickup}</p>
    <p>Drop Off: {customer.dropoff}</p>
  </div>
);

export default App;
