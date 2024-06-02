import React, { useState } from 'react';
import { Card, CardContent, Checkbox, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

function Home() {
  // Informations de l'étudiant (à remplacer par les données réelles)
  const studentInfo = {
    matricule: localStorage.getItem("nom"),
    nomPrenom: localStorage.getItem("prenom"),
    dateNaissance: localStorage.getItem("date_naissance")
  };

  // État des appareils
  const deviceStatus = {
    cameraPC: "activé",
    microphone: "activé",
    cameraFrontaleTel: "désactivé"
  };

  // Conditions de l'examen en ligne
  const examConditions = [
    "Avoir une connexion Internet stable.",
    "Avoir un environnement calme pour éviter les distractions.",
    "Respecter les règles de l'examen telles que le temps imparti.",
    "Ne pas utiliser de matériel interdit pendant l'examen."
  ];

  // État de la case à cocher pour accepter les conditions
  const [acceptConditions, setAcceptConditions] = useState(false);

  // Gérer le clic sur le bouton "Passer à l'examen"
  const handleExamStart = () => {
    window.location.href = '/exam';
    // Appel de l'API /surveillance avec la méthode GET
    axios.get('http://127.0.0.1:5000/surveillance')
      .then(response => {
        console.log(response.data);
        // Redirection vers la page d'examen si la surveillance est activée avec succès
        
      })
      .catch(error => {
        console.error('Erreur lors de l\'appel de l\'API de surveillance:', error);
        // Affichage d'un message d'erreur en cas d'échec de l'activation de la surveillance
      });
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Etape 3 : Vérification et validation des conditions d'examens</h2>

      {/* Première carte : Informations de l'étudiant */}
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Informations de l'étudiant
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Matricule:</strong> {studentInfo.matricule}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Nom et Prénom:</strong> {studentInfo.nomPrenom}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Date de naissance:</strong> {studentInfo.dateNaissance}
          </Typography>
        </CardContent>
      </Card>

      {/* Deuxième carte : État des appareils */}
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            État des appareils
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Box display="flex" alignItems="center">
              <Box
                width={20}
                height={20}
                borderRadius="50%"
                bgcolor={deviceStatus.cameraPC === 'activé' ? 'success.main' : 'error.main'}
                mr={1}
              />
              <Typography variant="body1" gutterBottom>
                <strong>Caméra du PC:</strong> {deviceStatus.cameraPC}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                width={20}
                height={20}
                borderRadius="50%"
                bgcolor={deviceStatus.microphone === 'activé' ? 'success.main' : 'error.main'}
                mr={1}
              />
              <Typography variant="body1" gutterBottom>
                <strong>Microphone:</strong> {deviceStatus.microphone}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                width={20}
                height={20}
                borderRadius="50%"
                bgcolor={deviceStatus.cameraFrontaleTel === 'activé' ? 'success.main' : 'error.main'}
                mr={1}
              />
              <Typography variant="body1" gutterBottom>
                <strong>Caméra frontale du téléphone:</strong> {deviceStatus.cameraFrontaleTel}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Troisième carte : Conditions de l'examen en ligne */}
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Conditions de l'examen en ligne
          </Typography>
          <ul>
            {examConditions.map((condition, index) => (
              <li key={index}><strong>{condition}</strong></li>
            ))}
          </ul>
          <Checkbox
            checked={acceptConditions}
            onChange={(event) => setAcceptConditions(event.target.checked)}
            inputProps={{ 'aria-label': 'Accepter les conditions' }}
          />
          <Typography variant="body2" gutterBottom>
            J'accepte les conditions de l'examen en ligne.
          </Typography>
          <Button
            variant="contained"
            disabled={!acceptConditions}
            onClick={handleExamStart}
            style={{ marginTop: '10px' }}
          >
            Passer à l'examen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '20px',
};

const cardStyle = {
  width: '100%',
  marginBottom: '20px',
};

const headerStyle = {
  fontSize: '24px',
  marginBottom: '20px',
};

export default Home;
