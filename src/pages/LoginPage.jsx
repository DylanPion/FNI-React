import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Authenticate } from "../services/AuthenticateService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const [enteredValues, setEnteredValues] = useState({
    login: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Vide les données du cache pour les utilisateurs déconnectés
  useEffect(() => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user-refreshToken");
    localStorage.removeItem("user-email");
  }, []);

  // Gère les changements dans les champs de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnteredValues({ ...enteredValues, [name]: value });
  };

  // Valide le formulaire
  const validateForm = () => {
    const newErrors = {};
    if (!enteredValues.login)
      newErrors.login = "Veuillez entrer une adresse email";
    if (!enteredValues.password)
      newErrors.password = "Veuillez entrer un mot de passe";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await Authenticate(enteredValues);
        localStorage.clear();
        localStorage.setItem("user-token", response.data.token);
        localStorage.setItem("user-refreshToken", response.data.refreshToken);
        localStorage.setItem("user-email", response.data.email);
        console.log("Connexion réussie avec succès");

        // Navigation après une connexion réussie
        setTimeout(() => {
          navigate("/dashboard/association");
        }, 500);
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        setErrors({
          login: "Erreur de connexion, veuillez vérifier vos identifiants",
        });
      }
    }
  };

  return (
    <div className="login-page">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <a href="#">Réseau entreprendre</a>
        <span>FNI</span>
      </div>

      <div className="login-container">
        <h1>Formulaire de connexion</h1>
        <form onSubmit={handleSubmit}>
          {/* Champ de l'email */}
          <label htmlFor="email">Email:</label>
          <div className="custome-input">
            <input
              type="email"
              name="login"
              placeholder="Votre Email"
              autoComplete="off"
              value={enteredValues.login}
              onChange={handleChange}
            />
            <i className="bx bx-at"></i>
          </div>
          {errors.login && (
            <span className="error-message">{errors.login}</span>
          )}

          {/* Champ du mot de passe */}
          <label htmlFor="password">Mot de passe:</label>
          <div className="custome-input">
            <input
              type={showPassword ? "text" : "password"} // Affiche le mot de passe si showPassword est vrai
              name="password"
              placeholder="Votre Mot de passe"
              value={enteredValues.password}
              onChange={handleChange}
            />
            <i
              className={`bx bx-lock-alt ${showPassword ? "show" : ""}`}
              onClick={() => setShowPassword(!showPassword)} // Toggle pour afficher/masquer le mot de passe
              style={{ cursor: "pointer" }} // Style pour montrer que l'icône est cliquable
            ></i>
          </div>
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}

          {/* Bouton de soumission */}
          <button className="login">Connexion</button>
          <div className="links">
            <a href="#">Réinitialiser le mot de passe</a>
            <a href="/signup">Créer un compte</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
