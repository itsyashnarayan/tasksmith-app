import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  CardActionArea,
} from '@mui/material';

const dashboardData = [
  {
    title: 'Users',
    items: ['Alice Johnson', 'Bob Smith', 'Charlie Davis'],
  },
  {
    title: 'Projects',
    items: ['Website Redesign', 'Internal Tooling', 'Marketing Launch'],
  },
  {
    title: 'Tasks',
    items: ['Create wireframes', 'Set up DB schema', 'JWT integration'],
  },
];

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
      >
        {dashboardData.map((section, index) => (
          <Card key={index} sx={{ height: '100%' }}>
            <CardActionArea>
              <CardHeader
                title={section.title}
                sx={{
                  borderBottom: '1px solid #eee',
                  backgroundColor: '#f5f5f5',
                }}
              />
              <CardContent>
                <List dense>
                  {section.items.map((item, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardPage;
