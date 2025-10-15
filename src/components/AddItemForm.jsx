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
import { findCategory, getAllCategories } from '../utils/categoryMapping';
import { useSuggestions } from '../hooks/useSuggestions';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { notificationService } from '../services/notificationService';
import { ref, get, set } from 'firebase/database';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { seedUserHistory, isHistoryEmpty } from '../utils/seedHistory';

// Récupérer les catégories depuis le système de mapping
const categories = getAllCategories();

export default function AddItemForm({ onAdd }) {
  const [item, setItem] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const { getSuggestions, getRelatedItems, recentItems } = useSuggestions();
  const { getSuggestedPrice, savePriceToHistory } = usePriceHistory();
  const { currentUser } = useAuth();
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const [isIOSStandalone, setIsIOSStandalone] = useState(false);
  const [useNativeInput, setUseNativeInput] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [showSeedButton, setShowSeedButton] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         navigator.standalone;
    
    console.log("Détection de l'environnement:", { isIOS, isStandalone });
    setIsIOSStandalone(isIOS && isStandalone);
    
    setUseNativeInput(isIOS);
  }, []);

  useEffect(() => {
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

  // Vérifier si l'historique est vide et afficher le bouton d'initialisation
  useEffect(() => {
    const checkHistory = async () => {
      if (currentUser && recentItems.length === 0) {
        const isEmpty = await isHistoryEmpty(currentUser.uid);
        setShowSeedButton(isEmpty);
      } else {
        setShowSeedButton(false);
      }
    };
    
    checkHistory();
  }, [currentUser, recentItems]);

  useEffect(() => {
    if (item.trim().length >= 2) {
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
      
      // Obtenir le prix suggéré (mais ne pas pré-remplir le champ)
      const priceInfo = getSuggestedPrice(item);
      setSuggestedPrice(priceInfo);
    } else {
      setSuggestedPrice(null);
    }
  }, [item]);

  // Sauvegarder l'article dans l'historique
  const saveToHistory = async (itemName, itemCategory) => {
    if (!currentUser) return;
    
    try {
      const historyRef = ref(db, `users/${currentUser.uid}/item-history/${itemName}`);
      const snapshot = await get(historyRef);
      const existingData = snapshot.val();
      
      await set(historyRef, {
        count: (existingData?.count || 0) + 1,
        lastUsed: Date.now(),
        category: itemCategory
      });
      
      console.log('Article sauvegardé dans l\'historique:', itemName);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans l\'historique:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (item.trim()) {
      const itemPrice = price ? parseFloat(price) : null;
      
      const newItem = {
        name: item.trim(),
        category: category,
        quantity: quantity.trim() || '1',
        price: itemPrice,
        timestamp: Date.now()
      };
      
      console.log('Ajout d\'un nouvel article:', newItem);
      
      try {
        await onAdd(newItem);
        console.log('Article ajouté avec succès');
        
        // Sauvegarder dans l'historique
        await saveToHistory(newItem.name, newItem.category);
        
        // Sauvegarder le prix dans l'historique si fourni
        if (itemPrice && itemPrice > 0) {
          await savePriceToHistory(newItem.name, itemPrice, newItem.category);
        }
        
        // Réinitialiser le formulaire après l'ajout réussi
        setItem('');
        setQuantity('');
        setPrice('');
        setSuggestedPrice(null);
        setShowDetails(false);
        
        // Focus sur le champ de saisie pour faciliter l'ajout d'un nouvel article
        if (inputRef.current) {
          inputRef.current.focus();
        }
        
        // NOTE: Les notifications sont temporairement désactivées pour éviter les erreurs
        // Le code de notification a été retiré pour résoudre les problèmes de boucle infinie
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'article:', error);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setItem(suggestion);
  };

  const handleSeedHistory = async () => {
    if (!currentUser) return;
    
    try {
      await seedUserHistory(currentUser.uid);
      setShowSeedButton(false);
      alert('✅ Historique initialisé ! Vous pouvez maintenant tester l\'autocomplétion en tapant "oe" pour oeufs ou "to" pour tomates.');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      alert('❌ Erreur lors de l\'initialisation de l\'historique');
    }
  };

  const focusInput = (e) => {
    console.log("focusInput appelé");
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (inputRef.current) {
      console.log("Tentative de focus sur l'input");
      inputRef.current.focus();
      setHasFocus(true);
    }
  };
  
  const handleBlur = () => {
    setHasFocus(false);
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {showSeedButton && (
        <Box 
          sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: '#E6FFFA',
            borderRadius: '12px',
            border: '1px solid #38B2AC'
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            💡 <strong>Astuce :</strong> Initialisez l'historique avec des articles courants pour tester l'autocomplétion immédiatement !
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={handleSeedHistory}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Initialiser l'historique
          </Button>
        </Box>
      )}
      <Box component="form" onSubmit={handleSubmit} className="add-item-form" ref={formRef}>
        <Box sx={{ display: 'flex', gap: 1, mb: showDetails ? 2 : 0 }}>
          <Box sx={{ flex: 1 }}>
            {useNativeInput ? (
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder="Ajouter un article..."
                  ref={inputRef}
                  autoComplete="on"
                  autoCorrect="on"
                  autoCapitalize="sentences"
                  spellCheck="true"
                  inputMode="text"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#F7FAFC',
                    border: hasFocus ? '1px solid #38B2AC' : '1px solid transparent',
                    outline: 'none',
                    fontSize: '16px',
                    WebkitAppearance: 'none',
                  }}
                />
                {suggestions.length > 0 && item.trim().length >= 2 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '0 0 12px 12px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    marginTop: '4px',
                    border: '1px solid #E2E8F0',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        onClick={() => {
                          setItem(suggestion);
                          setSuggestions([]);
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }}
                        style={{
                          padding: '12px 14px',
                          borderBottom: index < suggestions.length - 1 ? '1px solid #F7FAFC' : 'none',
                          cursor: 'pointer',
                          fontSize: '16px',
                          transition: 'background-color 0.2s',
                          backgroundColor: 'white'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFC'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <span style={{ fontWeight: 500, color: '#2D3748' }}>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
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
                    inputRef={inputRef}
                    onFocus={() => setHasFocus(true)}
                    onBlur={handleBlur}
                    autoComplete="on"
                    inputProps={{
                      ...params.inputProps,
                      autoCorrect: "on",
                      autoCapitalize: "sentences",
                      spellCheck: "true",
                      inputMode: "text",
                    }}
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
            )}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* Prix avec suggestion */}
            <Box>
              <TextField
                size="small"
                type="number"
                label="Prix (€)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                inputProps={{ 
                  step: "0.01",
                  min: "0",
                  inputMode: "decimal"
                }}
                className="input-field"
                sx={{
                  width: '100%',
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
              {suggestedPrice && (
                <Box sx={{ mt: 1 }}>
                  <Box 
                    onClick={() => setPrice(suggestedPrice.suggested.toFixed(2))}
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      p: 1,
                      backgroundColor: '#E6FFFA',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: '#B2F5EA',
                        transform: 'scale(1.02)',
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#2C7A7B', fontWeight: 600 }}>
                      {suggestedPrice.source === 'history' ? '💡 Votre prix habituel' : '💰 Prix moyen estimé'}: {suggestedPrice.suggested.toFixed(2)}€
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#38B2AC', fontSize: '0.65rem' }}>
                      (cliquer pour utiliser)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    {suggestedPrice.trend === 'up' && (
                      <Chip 
                        label="↗ En hausse" 
                        size="small" 
                        color="error" 
                        sx={{ height: '18px', fontSize: '0.65rem' }}
                      />
                    )}
                    {suggestedPrice.trend === 'down' && (
                      <Chip 
                        label="↘ En baisse" 
                        size="small" 
                        color="success" 
                        sx={{ height: '18px', fontSize: '0.65rem' }}
                      />
                    )}
                    {suggestedPrice.source === 'database' && (
                      <Chip 
                        label="Estimation" 
                        size="small" 
                        sx={{ 
                          height: '18px', 
                          fontSize: '0.65rem',
                          backgroundColor: '#E6FFFA',
                          color: '#38B2AC'
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                select
                size="small"
                label="Catégorie"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
                sx={{ 
                  flex: 1,
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
          </Box>
        )}
      </Box>
    </Box>
  );
}
