import { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export default function ShoppingItem({ item, index, onRemove }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleClick = () => {
    setIsCompleted(true);
    setTimeout(() => {
      onRemove(item.id);
    }, 300); // Petit délai pour voir l'animation
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            mb: 1,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
            opacity: isCompleted ? 0.5 : 1,
            '&:hover': {
              transform: 'translateX(4px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Box
            onClick={handleClick}
            sx={{
              mr: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: isCompleted ? 'primary.main' : isHovered ? 'primary.light' : 'grey.400',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {isCompleted ? (
              <CheckCircleIcon sx={{ fontSize: 24 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 24 }} />
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? 'text.secondary' : 'text.primary',
              }}
            >
              {item.name}
              {item.quantity && item.quantity !== '1' && ` (${item.quantity})`}
            </Typography>
          </Box>

          <Chip
            label={item.category}
            size="small"
            sx={{
              ml: 1,
              bgcolor: 'primary.light',
              color: 'white',
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        </Box>
      )}
    </Draggable>
  );
}
