import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { DragDropContext } from 'react-beautiful-dnd';
import { useFirebase } from '../hooks/useFirebase';
import { useAuth } from '../contexts/AuthContext';
import ShoppingList from '../components/ShoppingList';
import AddItemForm from '../components/AddItemForm';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import BudgetSummary from '../components/BudgetSummary';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import logo from '../assets/logo2.png';

const theme = createTheme({
  palette: {
    primary: {
      light: '#4FD1C5',
      main: '#38B2AC',
      dark: '#319795',
    },
    secondary: {
      light: '#FBD38D',
      main: '#F6AD55',
      dark: '#ED8936',
    },
    background: {
      default: '#F7FAFC',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function ListPage() {
  const { listId } = useParams();
  const { items, loading, addItem, removeItem, updateItem, userLists } = useFirebase(listId);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [currentList, setCurrentList] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trouver les détails de la liste actuelle
    if (userLists && userLists.length > 0) {
      const list = userLists.find(list => list.id === listId);
      if (list) {
        setCurrentList(list);
      }
    }
  }, [listId, userLists]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      setError('Échec de la déconnexion. Veuillez réessayer.');
    }
  };

  const handleBackToDashboard = () => {
    console.log('Navigation vers le dashboard');
    // Utiliser window.location pour forcer une navigation complète
    window.location.href = '/app';
  };

  const handleAddItem = async (newItem) => {
    try {
      console.log('Adding new item:', newItem);
      await addItem(newItem, listId);
      console.log('Item added successfully');
      setError(null);
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Erreur lors de l\'ajout de l\'article. Veuillez réessayer.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      console.log('Removing item:', itemId);
      await removeItem(itemId, listId);
      console.log('Item removed successfully');
      setError(null);
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Erreur lors de la suppression de l\'article. Veuillez réessayer.');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const sourceCategory = result.source.droppableId;
    const destinationCategory = result.destination.droppableId;

    const categoryItems = items.filter(item => item.category === sourceCategory);
    const itemToMove = categoryItems[sourceIndex];

    try {
      if (sourceCategory === destinationCategory) {
        const newOrder = Array.from(categoryItems);
        newOrder.splice(sourceIndex, 1);
        newOrder.splice(destinationIndex, 0, itemToMove);
        
        newOrder.forEach((item, index) => {
          updateItem(item.id, { ...item, order: index }, listId);
        });
      } else {
        updateItem(itemToMove.id, {
          ...itemToMove,
          category: destinationCategory
        }, listId);
      }

      setError(null);
    } catch (err) {
      console.error('Error updating item order:', err);
      setError('Erreur lors du déplacement de l\'article. Veuillez réessayer.');
    }
  };

  const filteredItems = items.filter(item =>
    (selectedCategory ? item.category === selectedCategory : true) &&
    (searchTerm ? 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    )
  );

  if (!listId) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography variant="h6" color="error">Liste non trouvée</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container">
        <Container maxWidth="sm">
          <Box sx={{ 
            mb: 6,
            position: 'relative',
            pt: 2, // Padding top pour éviter la safe area
          }}>
            {/* Boutons de navigation en haut */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
              gap: 1
            }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBackToDashboard}
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  py: 1,
                  px: 2,
                  minHeight: '44px', // Taille tactile recommandée
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  }
                }}
              >
                Retour
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLogout}
                startIcon={<ExitToAppIcon />}
                sx={{ 
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  py: 1,
                  px: 2,
                  minHeight: '44px', // Taille tactile recommandée
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  }
                }}
              >
                Déconnexion
              </Button>
            </Box>

            {/* Logo et titre */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mb: 4
              }}
            >
              <img 
                src={logo} 
                alt="Courses Faciles Logo" 
                style={{ 
                  width: '180px',
                  height: 'auto',
                  marginBottom: '16px',
                  filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))',
                  animation: 'float 3s ease-in-out infinite'
                }} 
              />
              <Typography 
                variant="h4" 
                component="h1" 
                align="center" 
                className="app-title"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #38B2AC 30%, #4FD1C5 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Courses Faciles
              </Typography>
              {currentList && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {currentList.storeLogo && (
                    <Box 
                      component="img"
                      src={currentList.storeLogo}
                      alt={currentList.storeName}
                      sx={{ 
                        height: '24px',
                        width: 'auto',
                        mr: 1
                      }}
                    />
                  )}
                  <Typography 
                    variant="h6" 
                    color="text.primary" 
                    sx={{ fontWeight: 600 }}
                  >
                    {currentList.name}
                  </Typography>
                </Box>
              )}
              {currentUser && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mt: 1 }}
                >
                  Connecté en tant que {currentUser.email}
                </Typography>
              )}
            </Box>
            
            <AddItemForm onAdd={handleAddItem} />
            
            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            {/* Résumé du budget */}
            {items.length > 0 && <BudgetSummary items={items} />}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <Box sx={{ flex: 1 }}>
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </Box>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <ShoppingList
                  items={filteredItems}
                  loading={loading}
                  onRemove={handleRemoveItem}
                  onUpdate={(itemId, updates) => updateItem(itemId, updates, listId)}
                />
              </DragDropContext>
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default ListPage;
