import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshToken } from "../services/TokenService";

// Décode le Token
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedData = JSON.parse(atob(base64));
    return decodedData;
  } catch (error) {
    return null;
  }
};

const SecureRoot = (props) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // // Renommage de la fonction refreshToken pour éviter la collision avec la constante refreshToken
  // const fetchRefreshToken = async (refreshToken) => {
  //   const response = await RefreshToken(refreshToken);
  //   console.log("Refresh token récupéré avec succès");
  // };

  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = localStorage.getItem("user-token");
      if (!userToken || userToken === "undefined") {
        setIsLoggedIn(false);
        return navigate("/login");
      } else {
        const decodedToken = decodeToken(userToken); // Décoder le token JWT manuellement
        if (
          !decodedToken ||
          (decodedToken.exp && decodedToken.exp < Date.now() / 1000)
        ) {
          // Token expiré ou invalide
          //setIsLoggedIn(false);
          const refreshToken = localStorage.getItem("refresh-token");
          //await fetchRefreshToken(refreshToken); // Utilisation de la fonction renommée
          return navigate("/login");
        } else {
          // Token valide
          setIsLoggedIn(true);
        }
      }
    };

    checkUserToken();
  }, []);

  return <>{isLoggedIn ? props.children : null}</>;
};

export default SecureRoot;
