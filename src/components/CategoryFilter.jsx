import { Box, Chip, IconButton, Collapse } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState } from 'react';

const categories = [
  'Tous',
  'Fruits et Légumes',
  'Produits Laitiers',
  'Viandes',
  'Épicerie',
  'Boissons',
  'Hygiène',
  'Autre'
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <IconButton 
        onClick={() => setShowFilters(!showFilters)}
        sx={{ 
          backgroundColor: showFilters ? 'primary.light' : 'transparent',
          color: showFilters ? 'white' : 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.light',
            color: 'white'
          }
        }}
      >
        <FilterListIcon />
      </IconButton>

      <Collapse in={showFilters}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            mt: 1,
            maxWidth: '100%',
            overflowX: 'auto',
            pb: 1
          }}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => {
                onCategoryChange(category === 'Tous' ? null : category);
                setShowFilters(false);
              }}
              color={selectedCategory === category || (category === 'Tous' && !selectedCategory) ? 'primary' : 'default'}
              variant={selectedCategory === category || (category === 'Tous' && !selectedCategory) ? 'filled' : 'outlined'}
              sx={{ 
                fontSize: '0.75rem',
                height: '24px',
                '&.MuiChip-filled': {
                  backgroundColor: 'primary.light',
                },
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                },
              }}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
