import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { CreateAccount } from "../services/AuthenticateService";

const SignupPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user-refreshToken");
    localStorage.removeItem("user-email");
  }, []);

  const [enteredValues, setEnteredValues] = useState({
    login: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // État pour gérer la visibilité du mot de passe

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnteredValues({ ...enteredValues, [name]: value });
  };

  const validateForm = () => {
    const { login, password, confirmPassword, firstName, lastName } =
      enteredValues;
    const newErrors = {};

    // Validation des champs
    if (!login) newErrors.login = "Login est requis";
    if (!firstName) newErrors.firstName = "Prénom est requis";
    if (!lastName) newErrors.lastName = "Nom est requis";
    if (!password) {
      newErrors.password = "Mot de passe est requis";
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe doivent correspondre";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retourne vrai si pas d'erreurs
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Simuler l'envoi à une API
        const response = await CreateAccount(enteredValues); // Correction ici
        console.log("Données envoyées :", response);

        // Réinitialiser le formulaire
        setEnteredValues({
          login: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
        });
        setErrors({});

        // Navigation après l'enregistrement réussi
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } catch (error) {
        console.error("Erreur lors de l'envoi des données :", error);
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
        <h1>Formulaire d'inscription</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login">Email:</label>
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
              onClick={() => setShowPassword(!showPassword)} // Toggle l'état showPassword
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}

          <label htmlFor="confirmPassword">Confirmer le Mot de passe:</label>
          <div className="custome-input">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={enteredValues.confirmPassword}
              onChange={handleChange}
            />
            <i
              className={`bx bx-lock-alt ${showPassword ? "show" : ""}`}
              onClick={() => setShowPassword(!showPassword)} // Toggle l'état showPassword
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}

          <label htmlFor="firstName">Prénom:</label>
          <div className="custome-input">
            <input
              type="text"
              name="firstName"
              placeholder="Votre Prénom"
              autoComplete="off"
              value={enteredValues.firstName}
              onChange={handleChange}
            />
            <i className="bx bx-at"></i>
          </div>
          {errors.firstName && (
            <span className="error-message">{errors.firstName}</span>
          )}

          <label htmlFor="lastName">Nom:</label>
          <div className="custome-input">
            <input
              type="text"
              name="lastName"
              placeholder="Votre Nom"
              autoComplete="off"
              value={enteredValues.lastName}
              onChange={handleChange}
            />
            <i className="bx bx-at"></i>
          </div>
          {errors.lastName && (
            <span className="error-message">{errors.lastName}</span>
          )}

          <button className="login">Inscription</button>
          <div className="links">
            <a href="#">Réinitialiser le mot de passe</a>
            <a href="/login">Créer un compte</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
