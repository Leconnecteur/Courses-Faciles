import { Box, Typography, Paper, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EuroIcon from '@mui/icons-material/Euro';
import { getAveragePrice } from '../data/averagePrices';

export default function BudgetSummary({ items }) {
  // Calculer le total et les statistiques
  const calculateStats = () => {
    let totalConfirmed = 0;
    let totalEstimated = 0;
    let itemsWithPrice = 0;
    let itemsWithEstimatedPrice = 0;

    items.forEach(item => {
      const quantity = parseInt(item.quantity) || 1;
      
      if (item.price && item.price > 0) {
        // Prix saisi par l'utilisateur
        totalConfirmed += item.price * quantity;
        itemsWithPrice++;
      } else {
        // Essayer d'obtenir un prix estimé
        const estimatedPrice = getAveragePrice(item.name);
        if (estimatedPrice) {
          totalEstimated += estimatedPrice * quantity;
          itemsWithEstimatedPrice++;
        }
      }
    });

    const total = totalConfirmed + totalEstimated;
    const itemsWithoutPrice = items.length - itemsWithPrice - itemsWithEstimatedPrice;
    const averagePerItem = itemsWithPrice > 0 ? totalConfirmed / itemsWithPrice : 0;

    return {
      total,
      totalConfirmed,
      totalEstimated,
      itemsWithPrice,
      itemsWithEstimatedPrice,
      itemsWithoutPrice,
      totalItems: items.length,
      averagePerItem
    };
  };

  const stats = calculateStats();

  // Déterminer la couleur selon le budget
  const getBudgetColor = (total) => {
    if (total === 0) return 'grey';
    if (total < 50) return 'success';
    if (total < 100) return 'primary';
    if (total < 150) return 'warning';
    return 'error';
  };

  const budgetColor = getBudgetColor(stats.total);

  if (items.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
        }
      }}
    >
      {/* Total principal */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Budget estimé
          </Typography>
        </Box>
        <Chip
          icon={<EuroIcon />}
          label={`${stats.total.toFixed(2)} €`}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.1rem',
            height: '36px',
            '& .MuiChip-icon': {
              color: 'white'
            }
          }}
        />
      </Box>

      {/* Statistiques détaillées */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        mt: 2,
        pt: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Box sx={{ flex: 1, minWidth: '120px' }}>
          <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
            Prix confirmés
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {stats.totalConfirmed.toFixed(2)} €
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.65rem' }}>
            {stats.itemsWithPrice} articles
          </Typography>
        </Box>

        {stats.totalEstimated > 0 && (
          <Box sx={{ flex: 1, minWidth: '120px' }}>
            <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
              Prix estimés
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#FBD38D' }}>
              {stats.totalEstimated.toFixed(2)} €
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.65rem' }}>
              {stats.itemsWithEstimatedPrice} articles
            </Typography>
          </Box>
        )}

        {stats.itemsWithoutPrice > 0 && (
          <Box sx={{ flex: 1, minWidth: '120px' }}>
            <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
              Sans prix
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#FC8181' }}>
              {stats.itemsWithoutPrice}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Message d'information */}
      {stats.totalEstimated > 0 && (
        <Box sx={{ 
          mt: 2, 
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '8px'
        }}>
          <Typography variant="caption" sx={{ display: 'block', opacity: 0.95 }}>
            💰 Budget incluant {stats.itemsWithEstimatedPrice} prix estimés automatiquement
          </Typography>
        </Box>
      )}
      
      {stats.itemsWithoutPrice > 0 && stats.totalEstimated === 0 && (
        <Box sx={{ 
          mt: 2, 
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '8px'
        }}>
          <Typography variant="caption" sx={{ display: 'block', opacity: 0.95 }}>
            💡 {stats.itemsWithoutPrice} articles sans prix estimé disponible
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
