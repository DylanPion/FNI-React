import instance from "../api/http";

// Fonction pour créer une fiche société
export const CreateProjectLeader = (data) => {
  return instance.post("/projectleader/", data);
};

// Fonction pour récupérer les données d'une fiche société
export const GetProjectLeader = (id) => {
  return instance.get(`/projectleader/${id}`);
};

// Fonction pour récupérer la liste des project leader d'une société
export const GetProjectLeaderFromCompanySheet = (id) => {
  return instance.get(`/projectleader/companySheet/${id}`);
};

// Fonction pour éditer une fiche société
export const EditProjectLeader = (data, id) => {
  return instance.put(`/projectleader/${id}`, data);
};

// Fonction pour supprimer une fiche société
export const DeleteProjectLeader = (id) => {
  return instance.delete(`/projectleader/${id}`);
};
