import axios from "axios";

// Création d'un intercepteur de requête

// Récupère le token
function getLocalAccessToken() {
  const accessToken = window.localStorage.getItem("user-token");
  return accessToken;
}

// Créer une instance du client HTTP
const instance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajoute un token à chaque requête sortante
instance.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
