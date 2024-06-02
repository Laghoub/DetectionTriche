import React from 'react';
import { Typography, Box, Button, Container } from '@mui/material';

function ExamResults({ examResults }) {
  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" gutterBottom>Résultats de l'examen</Typography>
        <Box width="100%" borderBottom={1} />
        <Box width="100%" marginTop="20px">
        <Typography variant="body1">15/20</Typography>
            
        
        </Box>
        <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>Retour</Button>
      </Box>
    </Container>
  );
}

export default ExamResults;
