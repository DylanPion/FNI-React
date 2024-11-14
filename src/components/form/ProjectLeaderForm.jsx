import React, { useEffect, useState } from "react";
import { CreateProjectLeader } from "../../services/ProjectLeaderService";
import InputField from "../ui/InputField";

const ProjectLeaderForm = ({ modalType, closeModal, companyIdCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    companySheetId: companyIdCreated,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Veuillez entrer le nom et prénom du porteur de projet";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Veuillez entrer une email valide";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Veuillez entrer un numéro de téléphone";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {}, []);
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (modalType === "create") {
        if (!validateForm()) return;
        const response = await CreateProjectLeader(formData);
        closeModal();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    // Ajouter la value
    <form onSubmit={handleSubmit}>
      <div>
        <InputField
          label={"Nom Prénom"}
          id={"name"}
          type={"text"}
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          placeholder={"Entrer le nom prénom du porteur de projet"}
        />
        <InputField
          label={"Email"}
          id={"email"}
          type={"email"}
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder={"Entrer une adresse email"}
        />
        <InputField
          label={"Numéro de téléphone"}
          id={"phoneNumber"}
          type={"text"}
          value={formData.phoneNumber}
          onChange={handleInputChange}
          error={errors.phoneNumber}
          placeholder={"Entrer le numéro un numéro de téléphone"}
        />
      </div>
      <button type="submit">
        {modalType === "edit" ? "Modifier" : "Créer"}
      </button>
    </form>
  );
};

export default ProjectLeaderForm;
