import instance from "../api/http";

// Fonction pour créer une comptabilité
export const CreateAccounting = (data) => {
  return instance.post("/accounting/", data);
};

// Fonction pour récupérer la liste des comptabilités
export const GetAccountingList = () => {
  return instance.get("/accounting/");
};
