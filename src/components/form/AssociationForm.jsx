import React, { useState, useEffect } from "react";
import {
  CreateAssociation,
  DeleteAssociation,
  EditAssociation,
} from "../../services/AssociationService";
import InputField from "../ui/InputField";

const AssociationForm = ({
  modalType,
  currentAssociation,
  closeModal,
  onUpdate,
}) => {
  const [associationData, setAssociationData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});

  // Valide le formulaire
  const validateForm = () => {
    const newErrors = {};
    if (!associationData.name.trim()) {
      newErrors.name = "Veuillez entrer le nom de l'Association";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (modalType === "edit" && currentAssociation) {
      setAssociationData({
        name: currentAssociation.name || "",
      });
    }
  }, [modalType, currentAssociation]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAssociationData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (modalType === "create") {
        if (!validateForm()) return;
        const response = await CreateAssociation(associationData);
        onUpdate(associationData);
        closeModal();
      } else if (modalType === "edit") {
        if (!validateForm()) return;
        const response = await EditAssociation(
          associationData,
          currentAssociation.id
        );
        onUpdate(response.data);
        closeModal();
      } else if (modalType === "delete") {
        const response = await DeleteAssociation(currentAssociation.id);
        onUpdate(response.data);
        closeModal();
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (modalType === "delete") {
    return (
      <div className="deleteModal">
        <button onClick={handleSubmit}>Oui</button>
        <button onClick={closeModal}>Annuler</button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <InputField
            label={"Nom de l'association"}
            id={"name"}
            type={"text"}
            value={associationData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder={"Entrer le nom de l'association"}
          />
        </div>
        <button type="submit">
          {modalType === "edit" ? "Modifier" : "Créer"}
        </button>
      </form>
    </>
  );
};

export default AssociationForm;
