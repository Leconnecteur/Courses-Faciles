import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      size="small"
      placeholder="Rechercher..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: '36px',
          borderRadius: '12px',
          backgroundColor: '#F7FAFC',
          '&:hover': {
            '& > fieldset': {
              borderColor: 'primary.main',
            },
          },
          '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
            '& > fieldset': {
              borderColor: 'primary.main',
            },
          }
        },
        '& .MuiOutlinedInput-input': {
          padding: '8px 4px',
          color: '#2D3748',
          '&::placeholder': {
            color: '#718096',
            opacity: 1,
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'transparent',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.light',
        },
        '& .MuiInputAdornment-root': {
          marginRight: '4px',
          marginLeft: '8px',
        }
      }}
    />
  );
}
