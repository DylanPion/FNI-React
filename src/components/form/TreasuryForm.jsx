import React, { useEffect, useState } from "react";
import {
  CreateAgreement,
  DeleteAgreement,
  EditAgreement,
} from "../../services/AgreementService";
import InputField from "../ui/InputField";

const TreasuryForm = ({
  modalType,
  currentAgreement,
  closeModal,
  onUpdate,
}) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    agreementNumber: "",
    askedAmountCdcBpi: "",
    receivedAmountCdcBpi: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.agreementNumber) {
      newErrors.agreementNumber = "Veuillez entrer un numéro de convention";
    }
    if (!formData.askedAmountCdcBpi) {
      // Corrigé : formData au lieu de formata
      newErrors.askedAmountCdcBpi =
        "Veuillez entrer le montant demandé par la CDC/BPI";
    }
    if (!formData.receivedAmountCdcBpi) {
      newErrors.receivedAmountCdcBpi =
        "Veuillez entrer le montant reçu par la CDC/BPI";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    console.log(currentAgreement);
    if (modalType === "edit" && currentAgreement) {
      setFormData({
        agreementNumber: currentAgreement.agreementNumber || "",
        askedAmountCdcBpi: currentAgreement.askedAmountCdcBpi || "",
        receivedAmountCdcBpi: currentAgreement.receivedAmountCdcBpi || "",
      });
    }
  }, [modalType, currentAgreement]);

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
        const response = await CreateAgreement(formData);
        onUpdate(formData);
        closeModal();
      } else if (modalType === "edit") {
        if (!validateForm()) return;
        console.log(currentAgreement);

        const response = await EditAgreement(formData, currentAgreement.id);
        onUpdate(response.data);
        closeModal();
      } else if (modalType === "delete") {
        const response = await DeleteAgreement(currentAgreement.id);
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
        <button onClick={handleSubmit}>Supprimer</button>
        <button onClick={closeModal}>Annuler</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <InputField
          label={"Numéro de convention"}
          id={"agreementNumber"}
          type={"text"}
          value={formData.agreementNumber}
          onChange={handleInputChange}
          error={errors.agreementNumber}
          placeholder={"Entrer le numéro de la convention"}
        />
      </div>
      <div>
        <InputField
          label={"Montant demandé par la CDC/BPI (€)"}
          id={"askedAmountCdcBpi"}
          type={"number"}
          value={formData.askedAmountCdcBpi}
          onChange={handleInputChange}
          error={errors.askedAmountCdcBpi}
          placeholder={"Entrer le montant demandé par la CDC/BPI"}
        />
      </div>
      <div>
        <InputField
          label={"Montant reçu par la CDC/BPI (€)"}
          id={"receivedAmountCdcBpi"}
          type={"text"}
          value={formData.receivedAmountCdcBpi}
          onChange={handleInputChange}
          error={errors.receivedAmountCdcBpi}
          placeholder={"Entrer le montant reçu par la CDC/BPI"}
        />
      </div>
      <button type="submit">
        {modalType === "edit" ? "Modifier" : "Créer"}
      </button>{" "}
      <i className="bx bx-plus" onClick={closeModal}></i>
    </form>
  );
};

export default TreasuryForm;
