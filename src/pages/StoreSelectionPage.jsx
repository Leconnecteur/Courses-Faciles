import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import StoreImage from '../components/StoreImage';
import { useFirebase } from '../hooks/useFirebase';
import { stores } from '../data/stores';
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

function StoreSelectionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { createList } = useFirebase();
  const navigate = useNavigate();

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStoreSelect = async (storeId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Créer une nouvelle liste avec le magasin sélectionné
      const listId = await createList(storeId);
      
      // Rediriger vers la liste nouvellement créée
      navigate(`/list/${listId}`);
    } catch (error) {
      console.error('Erreur lors de la création de la liste:', error);
      setError('Impossible de créer la liste. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/app');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container">
        <Container maxWidth="md">
          <Box sx={{ 
            mb: 6,
            position: 'relative',
          }}>
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
            
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBackClick}
              startIcon={<ArrowBackIcon />}
              sx={{ 
                position: 'absolute', 
                top: 8, 
                left: 0
              }}
            >
              Retour
            </Button>
            
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  color: '#2D3748',
                  textAlign: 'center'
                }}
              >
                Choisissez un magasin
              </Typography>
              
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher un magasin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center', mb: 2 }}>
                {error}
              </Typography>
            )}
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredStores.map((store) => (
                  <Grid item xs={6} sm={4} md={3} key={store.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <CardActionArea 
                        onClick={() => handleStoreSelect(store.id)}
                        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                        disabled={loading}
                      >
                        <Box sx={{ 
                          p: 2, 
                          backgroundColor: '#F7FAFC',
                          height: '120px'
                        }}>
                          <StoreImage 
                            src={store.logo} 
                            alt={store.name}
                            sx={{ height: '100%' }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                          <Typography 
                            variant="body1" 
                            component="div" 
                            sx={{ 
                              fontWeight: 500,
                              textAlign: 'center'
                            }}
                          >
                            {store.name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default StoreSelectionPage;
