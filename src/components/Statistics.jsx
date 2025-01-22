import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getShoppingAnalytics } from '../services/suggestions';

const COLORS = ['#38B2AC', '#4FD1C5', '#81E6D9', '#9FEBE4', '#B2F5EA'];

export default function Statistics() {
  const [value, setValue] = useState(0);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await getShoppingAnalytics();
      setAnalytics(data);
    };
    loadAnalytics();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!analytics) return null;

  const categoryData = Object.entries(analytics.categoryStats).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyData = Object.entries(analytics.monthlyStats).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Statistiques
      </Typography>

      <Tabs value={value} onChange={handleChange} sx={{ mb: 3 }}>
        <Tab label="Par Catégorie" />
        <Tab label="Par Mois" />
        <Tab label="Articles Populaires" />
      </Tabs>

      {value === 0 && (
        <Paper sx={{ p: 3, height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {value === 1 && (
        <Paper sx={{ p: 3, height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#38B2AC" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {value === 2 && (
        <Paper sx={{ p: 3 }}>
          <List>
            {analytics.topItems.map((item, index) => (
              <ListItem key={item} divider={index !== analytics.topItems.length - 1}>
                <ListItemText
                  primary={item}
                  secondary={`#${index + 1} des articles les plus achetés`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
