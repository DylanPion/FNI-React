import instance from "../api/http";

export const RefreshToken = (data) => {
  return instance.post("/auth/refreshtoken", data);
};
