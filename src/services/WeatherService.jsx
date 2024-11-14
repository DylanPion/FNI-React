import instance from "../api/http";

// Fonction pour créer une association
export const CreateWeather = (data) => {
  return instance.post("/weather/", data);
};

export const GetWeatherByCompany = (
  companySheetId,
  page = 0,
  size = 5,
  search = ""
) => {
  return instance.get(
    `/weather/${companySheetId}?page=${page}&size=${size}&search=${search}`
  );
};

export const EditWeather = (id, data) => {
  return instance.put(`/weather/${id}`, data);
};

export const DeleteWeather = (id) => {
  return instance.delete(`/weather/${id}`);
};

// Fonction pour récupérer le total des colonnes
export const GetTotalWeather = (id) => {
  return instance.get(`/weather/total/${id}`);
};
