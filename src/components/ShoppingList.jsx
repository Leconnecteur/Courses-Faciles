import { Box, CircularProgress, Typography } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import ShoppingItem from './ShoppingItem';
import { saveToHistory } from '../services/shoppingHistory';

export default function ShoppingList({ items, loading, onRemove, onUpdate }) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography color="text.secondary">
          Votre liste de courses est vide
        </Typography>
      </Box>
    );
  }

  // Grouper les items par catégorie
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Autre';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const handleToggleComplete = async (item) => {
    const updatedItem = { ...item, completed: !item.completed };
    await onUpdate(item.id, updatedItem);
    
    // Si l'article vient d'être marqué comme complété, on l'ajoute à l'historique
    if (!item.completed) {
      await saveToHistory(updatedItem);
    }
  };

  return (
    <Box>
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <Box key={category} mb={3}>
          <Typography
            variant="h6"
            component="h2"
            color="primary"
            gutterBottom
            sx={{ ml: 1 }}
          >
            {category}
          </Typography>
          <Droppable droppableId={category}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {categoryItems.map((item, index) => (
                  <ShoppingItem
                    key={item.id}
                    item={item}
                    index={index}
                    onRemove={onRemove}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Box>
      ))}
    </Box>
  );
}
