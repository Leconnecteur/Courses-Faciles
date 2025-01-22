import { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  MenuItem, 
  IconButton,
  Autocomplete,
  Chip,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { findCategory } from '../utils/categoryMapping';
import { useSuggestions } from '../hooks/useSuggestions';

const categories = [
  'Fruits et Légumes',
  'Produits Laitiers',
  'Viandes',
  'Épicerie',
  'Boissons',
  'Hygiène',
  'Autre'
];

export default function AddItemForm({ onAdd }) {
  const [item, setItem] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [quantity, setQuantity] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const { getSuggestions, getRelatedItems } = useSuggestions();

  useEffect(() => {
    if (item.trim().length > 1) {
      const newSuggestions = getSuggestions(item);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [item, getSuggestions]);

  useEffect(() => {
    if (item.trim()) {
      const related = getRelatedItems(item);
      setRelatedItems(related);
    } else {
      setRelatedItems([]);
    }
  }, [item, getRelatedItems]);

  useEffect(() => {
    if (item.trim()) {
      const suggestedCategory = findCategory(item);
      setCategory(suggestedCategory);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.trim()) return;

    onAdd({
      name: item.trim(),
      category: category,
      quantity: quantity || '1',
      completed: false,
      createdAt: Date.now()
    });

    setItem('');
    setCategory(categories[0]);
    setQuantity('');
  };

  const handleSuggestionClick = (suggestion) => {
    setItem(suggestion);
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box component="form" onSubmit={handleSubmit} className="add-item-form">
        <Box sx={{ display: 'flex', gap: 1, mb: showDetails ? 2 : 0 }}>
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              freeSolo
              value={item}
              onChange={(event, newValue) => setItem(newValue || '')}
              onInputChange={(event, newValue) => setItem(newValue)}
              options={suggestions}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  padding: '0px !important',
                },
                '& .MuiAutocomplete-input': {
                  padding: '8.5px 14px !important',
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Ajouter un article..."
                  size="small"
                  className="input-field"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#F7FAFC',
                      '&:hover': {
                        '& > fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.light',
                    },
                  }}
                />
              )}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{
              minWidth: 'auto',
              height: 40,
              width: 40,
              borderRadius: '12px',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <AddIcon />
          </Button>
        </Box>

        {relatedItems.length > 0 && (
          <Box sx={{ mt: 1, mb: showDetails ? 2 : 0 }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mb: 1, 
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            >
              Souvent acheté avec :
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {relatedItems.map((related) => (
                <Chip
                  key={related}
                  label={related}
                  size="small"
                  onClick={() => handleSuggestionClick(related)}
                  sx={{ 
                    cursor: 'pointer',
                    backgroundColor: 'primary.light',
                    color: 'white',
                    fontSize: '0.75rem',
                    height: '24px',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <IconButton
            size="small"
            onClick={() => setShowDetails(!showDetails)}
            sx={{ mr: 1, color: 'text.secondary' }}
          >
            {showDetails ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <span className="text-sm text-gray-500">
            {showDetails ? 'Masquer les détails' : 'Ajouter des détails'}
          </span>
        </Box>

        {showDetails && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField
              select
              size="small"
              label="Catégorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
              sx={{ 
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#F7FAFC',
                  '&:hover': {
                    '& > fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.light',
                },
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              type="number"
              label="Quantité"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input-field"
              sx={{
                width: 100,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#F7FAFC',
                  '&:hover': {
                    '& > fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.light',
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
