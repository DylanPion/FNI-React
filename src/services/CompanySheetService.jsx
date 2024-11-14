import instance from "../api/http";

// Fonction pour créer une fiche société
export const CreateCompanySheet = (data) => {
  return instance.post("/companysheet/", data);
};

// Fonction pour récupérer les données d'une fiche société
export const GetCompanySheet = (id) => {
  return instance.get(`/companysheet/${id}`);
};

// Fonction pour récupérer la liste des fiche société
export const GetCompanySheetList = (id, page = 0, size = 15, search = "") => {
  return instance.get(
    `/companysheet/association/${id}?page=${page}&size=${size}&search=${search}`
  );
};

// Fonction pour éditer une fiche société
export const EditCompanySheet = (data, id) => {
  return instance.put(`/companysheet/${id}`, data);
};

// Fonction pour supprimer une fiche société
export const DeleteCompanySheet = (id) => {
  return instance.delete(`/companysheet/${id}`);
};

// Fonction pour récupérer le total des colonnes
export const GetTotalByAssociation = (id) => {
  return instance.get(`/companysheet/total/${id}`);
};
