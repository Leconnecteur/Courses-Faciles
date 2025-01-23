import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DragDropContext } from 'react-beautiful-dnd';
import { useFirebase } from './hooks/useFirebase';
import ShoppingList from './components/ShoppingList';
import AddItemForm from './components/AddItemForm';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import logo from './assets/logo2.png';
import './index.css';

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

function App() {
  const { items, loading, addItem, removeItem, updateItem } = useFirebase();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  const handleAddItem = async (newItem) => {
    try {
      console.log('Adding new item:', newItem);
      await addItem(newItem);
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
      await removeItem(itemId);
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
          updateItem(item.id, { ...item, order: index });
        });
      } else {
        updateItem(itemToMove.id, {
          ...itemToMove,
          category: destinationCategory
        });
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container">
        <Container maxWidth="sm">
          <Box sx={{ mb: 6 }}>
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
            </Box>
            
            <AddItemForm onAdd={handleAddItem} />
            
            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <Box sx={{ flex: 1 }}>
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </Box>
            </Box>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <ShoppingList
                items={filteredItems}
                loading={loading}
                onRemove={handleRemoveItem}
                onUpdate={updateItem}
              />
            </DragDropContext>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
