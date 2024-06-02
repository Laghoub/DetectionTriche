import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Checkbox, Button } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Exam() {
 
  // Questions de l'examen et leurs choix multiples
  const questions = [
    {
      question: "Qu'est-ce que HTML?",
      choices: [
        "Un langage de programmation",
        "Un protocole de communication",
        "Une technologie pour structurer les pages web",
        "Un langage de requête de bases de données"
      ]
    },
    {
      question: "Quel est le langage de programmation le plus utilisé pour le développement web côté client?",
      choices: [
        "Python",
        "JavaScript",
        "Java",
        "C#"
      ]
    },
    {
      question: "Qu'est-ce que CSS?",
      choices: [
        "Un langage de programmation",
        "Une technologie pour créer des bases de données",
        "Une technologie pour styliser les pages web",
        "Un format de fichier audio"
      ]
    },
    {
      question: "Quel est le rôle de JavaScript dans le développement web?",
      choices: [
        "Gérer le style et la présentation des pages web",
        "Fournir la logique et l'interactivité des pages web",
        "Gérer les bases de données",
        "Stocker des fichiers multimédias sur le serveur"
      ]
    },
    {
      question: "Quel est le langage de programmation utilisé pour créer des requêtes et interagir avec les bases de données?",
      choices: [
        "C++",
        "JavaScript",
        "SQL",
        "Python"
      ]
    },
    {
      question: "Quel est le principal avantage des bases de données relationnelles?",
      choices: [
        "Stockage des données sous forme de fichiers texte",
        "Stockage des données dans une structure hiérarchique",
        "Relation entre différentes tables de données",
        "Stockage des données dans des feuilles de calcul"
      ]
    },
    {
      question: "Qu'est-ce que le paradigme de programmation orientée objet?",
      choices: [
        "Programmation basée sur les événements",
        "Programmation basée sur des objets et des classes",
        "Programmation basée sur des fonctions",
        "Programmation basée sur des modules"
      ]
    },
    {
      question: "Quel est le rôle des serveurs dans les applications web?",
      choices: [
        "Fournir des ressources graphiques pour les pages web",
        "Traiter les requêtes des clients et fournir des données",
        "Enregistrer les entrées utilisateur sur le navigateur",
        "Afficher des publicités sur les pages web"
      ]
    },
    {
      question: "Qu'est-ce que Git?",
      choices: [
        "Un langage de programmation",
        "Un logiciel de gestion de base de données",
        "Un système de contrôle de version pour le suivi des modifications de code",
        "Un langage de requête de bases de données"
      ]
    },
    {
      question: "Qu'est-ce que l'algorithme de recherche binaire?",
      choices: [
        "Un algorithme pour trier des éléments dans un tableau",
        "Un algorithme pour rechercher un élément dans un tableau trié",
        "Un algorithme pour rechercher un élément dans un tableau non trié",
        "Un algorithme pour comparer deux chaînes de caractères"
      ]
    }
  ];

  // État des réponses sélectionnées par l'utilisateur
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(questions.length).fill(-1));

  // Gérer la sélection d'une réponse
  const handleAnswerSelect = (questionIndex, choiceIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = choiceIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  // Gérer le clic sur le bouton "Soumettre l'examen"
  const handleSubmitExam = () => {
    
    // Appel de l'API /surveillance avec la méthode GET
    axios.get('http://127.0.0.1:5000/stoprecord')
      .then(response => {
        console.log(response.data);
        // Redirection vers la page d'examen si la surveillance est activée avec succès
        
      })
      .catch(error => {
        console.error('Erreur lors de l\'appel de l\'API de surveillance:', error);
        // Affichage d'un message d'erreur en cas d'échec de l'activation de la surveillance
      });
      window.location.href = '/result';
  };



  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Examen d'informatique</h2>
      {questions.map((questionObj, questionIndex) => (
        <Card key={questionIndex} style={cardStyle}>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              {questionObj.question}
            </Typography>
            {questionObj.choices.map((choice, choiceIndex) => (
              <Box key={choiceIndex} display="flex" alignItems="center">
                <Checkbox
                  checked={selectedAnswers[questionIndex] === choiceIndex}
                  onChange={() => handleAnswerSelect(questionIndex, choiceIndex)}
                  inputProps={{ 'aria-label': 'Sélectionner la réponse' }}
                />
                <Typography variant="body2" gutterBottom>
                  {choice}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        onClick={handleSubmitExam}
        style={{ marginTop: '20px' }}
      >
        Soumettre l'examen
      </Button>
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

export default Exam;
