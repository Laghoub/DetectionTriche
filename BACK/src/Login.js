import { useEffect, useState } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import logo from "./logo.jpg"
import VerifyIdentity from "./VerifyIdentity";
import axios from 'axios';


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

 

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        }
      });
  
      setMessage(response.data.message);
      if (response.status === 200) {
        // Stocker les informations dans le localStorage
        const { nom, prenom, date_naissance } = response.data.user;
        localStorage.setItem("connected", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("nom", nom);
        localStorage.setItem("prenom", prenom);
        localStorage.setItem("date_naissance", date_naissance);
        
        console.log(response.data);
        // Si le login est réussi, rediriger vers la page de vérification d'identité
        window.location.href = '/verify';
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("Une erreur s'est produite lors de la connexion.");
    }
  };
  


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={logo}
          alt="Votre Image"
          style={{ width: "150px", height: "150px" }}
        />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        {message && <div style={{ color: "red" }}>{message}</div>}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "#189AB4" }}
          >
            Sign In
          </Button>
          <Grid container>
            {/*   <Grid item xs>
              <Link href="#" variant="body2" sx={{ color: "#186049" }}>
                Forgot password?
              </Link>
            </Grid>
            */}
            <Grid item>
              <Link href="#" variant="body2" sx={{ color: "#186049" }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );

/*
  return (

    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
*/
}

export default Login;
