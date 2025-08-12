import { useState } from 'react';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';

// Composant pour gérer l'affichage des images de magasin avec fallback
const StoreImage = ({ src, alt, sx = {} }) => {
  const [error, setError] = useState(false);
  
  // Image de fallback générique pour les magasins
  const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        ...sx
      }}
    >
      <CardMedia
        component="img"
        image={error ? fallbackImage : src}
        alt={alt}
        onError={() => setError(true)}
        sx={{ 
          width: 'auto',
          maxWidth: '80%',
          maxHeight: '100px',
          objectFit: 'contain'
        }}
      />
    </Box>
  );
};

export default StoreImage;
