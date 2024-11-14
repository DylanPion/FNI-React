import instance from "../api/http";

// Fonction pour créer une association
export const CreateAssociation = (data) => {
  return instance.post("/association/", data);
};

// Fonction pour récupérer la liste paginée des associations
export const GetAssociationList = (page = 0, size = 15, search = "") => {
  return instance.get(
    `/association/?page=${page}&size=${size}&search=${search}`
  );
};

// Fonction pour éditer une association
export const EditAssociation = (data, id) => {
  return instance.put(`/association/${id}`, data);
};

// Fonction pour supprimer une association
export const DeleteAssociation = (id) => {
  return instance.delete(`/association/${id}`);
};

// Récupère le nom d'une association
export const GetAssociationName = (id) => {
  return instance.get(`/association/getName/${id}`);
};

export const GetAssociationListDTO = () => {
  return instance.get("/association/name");
};

// Fonction pour récupérer le total des colonnes
export const GetTotalAssociation = () => {
  return instance.get("/association/total");
};
