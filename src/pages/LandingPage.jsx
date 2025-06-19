import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  useTheme,
} from '@mui/material';
import logo from '../assets/logo2.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShareIcon from '@mui/icons-material/Share';
import SecurityIcon from '@mui/icons-material/Security';

const FeatureItem = ({ icon, title, description }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        },
        borderRadius: 4,
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" component="h3" fontWeight="600" gutterBottom align="center">
        {title}
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};

const LandingPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        pt: 4,
        pb: 6,
      }}
    >
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            mb: 6,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Courses Faciles Logo"
            sx={{
              width: '220px',
              height: 'auto',
              mb: 3,
              filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))',
              animation: 'float 3s ease-in-out infinite',
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            fontWeight="700"
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #38B2AC 30%, #4FD1C5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Courses Faciles
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ mb: 4, maxWidth: '800px' }}
          >
            Simplifiez votre liste de courses et accédez-y de partout
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              color="primary"
              sx={{
                fontSize: '1.1rem',
                py: 1.5,
                px: 4,
                fontWeight: 600,
                boxShadow: '0 4px 10px rgba(56, 178, 172, 0.3)',
              }}
            >
              S'inscrire
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                fontSize: '1.1rem',
                py: 1.5,
                px: 4,
                fontWeight: 600,
                borderWidth: 2,
              }}
            >
              Se connecter
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureItem
                icon={<ShoppingCartIcon fontSize="large" />}
                title="Simple et Efficace"
                description="Ajoutez des articles à votre liste en quelques secondes et organisez-les facilement"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureItem
                icon={<ListAltIcon fontSize="large" />}
                title="Liste Personnalisée"
                description="Vos listes vous appartiennent et sont sécurisées avec votre compte"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureItem
                icon={<ShareIcon fontSize="large" />}
                title="Accessible Partout"
                description="Accédez à votre liste sur tous vos appareils, même hors ligne"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureItem
                icon={<SecurityIcon fontSize="large" />}
                title="Sécurité"
                description="Vos données sont protégées et privées. Personne d'autre n'y a accès"
              />
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            backgroundColor: 'rgba(56, 178, 172, 0.1)',
            borderRadius: 4,
            p: 5,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h2" fontWeight="600" gutterBottom>
            Prêt à simplifier vos courses ?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }}>
            Créez votre compte gratuitement et commencez à utiliser Courses Faciles dès aujourd'hui.
          </Typography>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            size="large"
            color="primary"
            sx={{
              fontSize: '1.1rem',
              py: 1.5,
              px: 4,
              fontWeight: 600,
              boxShadow: '0 4px 10px rgba(56, 178, 172, 0.3)',
            }}
          >
            Commencer maintenant
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
