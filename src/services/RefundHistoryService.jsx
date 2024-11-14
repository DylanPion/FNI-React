import instance from "../api/http";

// Fonction pour créer une association
export const CreateRefundPayment = (data) => {
  return instance.post("/refundHistory/", data);
};

export const GetRefundPaymentByCompany = (
  companySheetId,
  page = 0,
  size = 5,
  search = ""
) => {
  return instance.get(
    `/refundHistory/${companySheetId}?page=${page}&size=${size}&search=${search}`
  );
};

export const EditRefundPayment = (id, data) => {
  return instance.put(`/refundHistory/${id}`, data);
};

export const DeleteRefundPayment = (id) => {
  return instance.delete(`/refundHistory/${id}`);
};

// Fonction pour récupérer le total des colonnes
export const GetTotalPayment = (id) => {
  return instance.get(`/refundHistory/total/${id}`);
};
