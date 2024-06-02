import React, { useState } from 'react';
import Login from './Login';
import face from './face_verif.jpg'

function VerifyIdentity() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null); // Nouvel état pour stocker le résultat de la vérification
  const username = localStorage.getItem('username');
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const redirection = () => {
    window.location.href = '/home';
  };

  const handleVerification = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/verify-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username})
      });
      const data = await response.json();
      if (data.message==="validée"){
        console.log(token);
        setMessage("La vérification de l'identité a été vérifiée! il s'agit bien de " + data.names);
        setVerificationResult(true); // Définir le résultat de la vérification comme réussi
      } else {
        setMessage("La vérification de l'identité a été échouée! il s'agit pas de " + username);
        setVerificationResult(false); // Définir le résultat de la vérification comme échoué
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={pageStyle}>
      <h2 style={headerStyle}>Etape 2 : Vérification de l'identité</h2>
      <div style={containerStyle}>
        <div style={columnStyle}>
          <div>
            <img src={face} alt="Camera Image" style={cameraImageStyle} />
            <p style={cameraTextStyle}>Mettez votre visage devant la caméra pour vérifier votre identité.</p>
          </div>
        </div>
        <div style={columnStyle}>
          <div>
            {verificationResult ? (
              <>
                <p style={successMessageStyle}>{message}</p>
                <button style={continueButtonStyle} onClick={redirection}>Continuer</button>
              </>
            ) : (
              <p style={errorMessageStyle}>{message}</p>
            )}
            {error && <p style={errorStyle}>{error}</p>}
            {!verificationResult && (
              <button style={buttonStyle} onClick={handleVerification}>Vérifier l'identité</button>
            )}
          </div>
        </div>
      </div>
      {localStorage.getItem("connected") !== "true" && <Login />}
    </div>
  );
}

// Styles
const pageStyle = {
  padding: "80px"
}
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
};

const headerStyle = {
  fontSize: '24px',
  marginBottom: '20px',
};

const columnStyle = {
  width: '50%',
  display: 'inline-block',
  verticalAlign: 'top',
};

const cameraImageStyle = {
  width: '380px',
  height: '260px',
};

const cameraTextStyle = {
  fontSize: '16px',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '18px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
};

const continueButtonStyle = {
  padding: '10px 20px',
  fontSize: '18px',
  backgroundColor: 'green',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
};

const successMessageStyle = {
  fontSize: '18px',
  color: 'green',
};

const errorMessageStyle = {
  fontSize: '18px',
  color: 'red',
};

const errorStyle = {
  fontSize: '18px',
  color: 'red',
};

export default VerifyIdentity;
