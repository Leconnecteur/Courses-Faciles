import { useState, useEffect, useRef } from 'react';
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
import { notificationService } from '../services/notificationService';
import { ref, get } from 'firebase/database';

const categories = [
  'Fruits et Légumes',
  'Produits Laitiers',
  'Viandes',
  'Épicerie',
  'Boissons',
  'Hygiène',
  'Autre'
];

export default function AddItemForm({ onAdd, db }) {
  const [item, setItem] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [quantity, setQuantity] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const { getSuggestions, getRelatedItems } = useSuggestions();
  const inputRef = useRef(null);

  useEffect(() => {
    // Demander la permission pour les notifications au chargement du composant
    const requestNotificationPermission = async () => {
      try {
        console.log('Demande de permission de notifications...');
        const result = await notificationService.requestPermission();
        console.log('Résultat de la demande de permission:', result);
      } catch (error) {
        console.error('Erreur lors de la demande de permission:', error);
      }
    };
    requestNotificationPermission();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (item.trim()) {
      const newItem = {
        name: item.trim(),
        category: category,
        quantity: quantity.trim() || '1',
        timestamp: Date.now()
      };
      
      console.log('Ajout d\'un nouvel article:', newItem);
      await onAdd(newItem);
      
      try {
        console.log('Préparation de la notification...');
        const message = {
          notification: {
            title: 'Nouvel article ajouté',
            body: `${newItem.name} a été ajouté à la liste`,
          },
          data: {
            title: 'Nouvel article ajouté',
            body: `${newItem.name} a été ajouté à la liste`,
            itemName: newItem.name,
            category: newItem.category
          }
        };

        console.log('Récupération des tokens pour les notifications...');
        const tokensRef = ref(db, 'notification_tokens');
        const snapshot = await get(tokensRef);
        const tokens = snapshot.val() || {};
        
        console.log('Tokens disponibles:', tokens);
        
        // Pour chaque token enregistré
        for (const tokenData of Object.values(tokens)) {
          if (tokenData.token) {
            console.log(`Envoi de la notification au navigateur ${tokenData.browser}`);
            try {
              const response = await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `key=${import.meta.env.VITE_FCM_SERVER_KEY}`
                },
                body: JSON.stringify({
                  to: tokenData.token,
                  ...message
                })
              });
              
              const result = await response.json();
              console.log('Résultat de l\'envoi:', result);
            } catch (error) {
              console.error('Erreur lors de l\'envoi de la notification:', error);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi des notifications:', error);
      }
      
      setItem('');
      setQuantity('');
      setCategory(categories[0]);
      setSuggestions([]);
      setRelatedItems([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setItem(suggestion);
  };

  const focusInput = () => {
    // Force le focus et l'ouverture du clavier sur iOS
    if (inputRef.current) {
      inputRef.current.focus();
      // Petit délai pour s'assurer que le focus est appliqué
      setTimeout(() => {
        inputRef.current.click();
      }, 100);
    }
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
              onClick={focusInput}
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
                  inputRef={inputRef}
                  onClick={focusInput}
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
