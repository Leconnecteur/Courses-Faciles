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
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import StoreImage from '../components/StoreImage';
import { useFirebase } from '../hooks/useFirebase';
import { useAuth } from '../contexts/AuthContext';
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

function DashboardPage() {
  const { userLists, loadingLists, deleteList } = useFirebase();
  const [error, setError] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      setError('Échec de la déconnexion. Veuillez réessayer.');
    }
  };

  const handleCreateList = () => {
    navigate('/new-list');
  };

  const handleOpenList = (listId) => {
    navigate(`/list/${listId}`);
  };
  
  const handleDeleteList = async (event, listId) => {
    event.stopPropagation(); // Empêcher la propagation vers CardActionArea
    try {
      await deleteList(listId);
    } catch (error) {
      console.error('Erreur lors de la suppression de la liste:', error);
      setError('Échec de la suppression de la liste. Veuillez réessayer.');
    }
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
            
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              startIcon={<ExitToAppIcon />}
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 0
              }}
            >
              Déconnexion
            </Button>
            
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  mb: 2,
                  fontWeight: 600,
                  color: '#2D3748'
                }}
              >
                Mes listes de courses
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateList}
                sx={{
                  mb: 3,
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(56, 178, 172, 0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 10px rgba(56, 178, 172, 0.3)',
                  }
                }}
              >
                Nouvelle liste
              </Button>
            </Box>
            
            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center', mb: 2 }}>
                {error}
              </Typography>
            )}
            
            {loadingLists ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : userLists.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 6,
                  backgroundColor: '#EDF2F7',
                  borderRadius: '12px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <ShoppingCartIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: '#A0AEC0',
                    mb: 2
                  }} 
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Vous n'avez pas encore de liste de courses
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateList}
                >
                  Créer ma première liste
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {userLists.map((list) => (
                  <Grid item xs={12} sm={6} md={4} key={list.id}>
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
                        onClick={() => handleOpenList(list.id)}
                        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', position: 'relative' }}
                      >
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => handleDeleteList(e, list.id)}
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8, 
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            }
                          }}
                          aria-label="supprimer la liste"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Box sx={{ 
                          p: 2, 
                          backgroundColor: '#F7FAFC',
                          height: '140px'
                        }}>
                          <StoreImage 
                            src={list.storeLogo} 
                            alt={list.storeName}
                            sx={{ height: '100%' }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
                            {list.name}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 1
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              {list.itemCount} article{list.itemCount !== 1 ? 's' : ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(list.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
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

export default DashboardPage;
