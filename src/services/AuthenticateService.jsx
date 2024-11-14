import instance from "../api/http";

export const CreateAccount = (data) => {
  return instance.post("/auth/signup", data);
};

export const Authenticate = (data) => {
  return instance.post("auth/login", data);
};
