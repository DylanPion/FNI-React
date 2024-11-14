import instance from "../api/http";

// Fonction pour créer une convention
export const CreateAgreement = (data) => {
  return instance.post("/agreement/", data);
};
// Fonction pour récupérer la liste des convention
export const GetAgreementList = () => {
  return instance.get("/agreement/");
};

// Fonction pour récupérer la trésorerie
export const GetTreasury = () => {
  return instance.get("/agreement/treasury");
};

// Fonction pour éditer une convention
export const EditAgreement = (data, id) => {
  return instance.put(`/agreement/${id}`, data);
};

// Fonction pour supprimer une convention
export const DeleteAgreement = (id) => {
  return instance.delete(`/agreement/${id}`);
};

// Fonction pour récupérer la liste des conventions Dto
export const GetAgreementNumber = () => {
  return instance.get("/agreement/number");
};
