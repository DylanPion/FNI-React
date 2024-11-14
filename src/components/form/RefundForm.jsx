import React, { useEffect, useState } from "react";
import {
  CreateRefundPayment,
  DeleteRefundPayment,
  EditRefundPayment,
} from "../../services/RefundHistoryService";
import { useParams } from "react-router-dom";
import InputField from "../ui/InputField";

const RefundForm = ({ modalType, currentRefund, closeModal, onUpdate }) => {
  const { companySheetId } = useParams();
  const [formData, setFormData] = useState({
    companySheetId: companySheetId,
    companyId: "",
    payment: "",
    date: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.payment.trim()) {
      newErrors.payment = "Veuillez entrer un paiement";
    }
    if (!formData.date.trim()) {
      newErrors.date = "Veuillez entrer une date ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (modalType === "edit" && currentRefund) {
      console.log(currentRefund);

      // Fonction pour convertir un tableau de date [yyyy, mm, dd] en format yyyy-MM-dd
      const formatDate = (dateArray) => {
        if (Array.isArray(dateArray) && dateArray.length === 3) {
          const [year, month, day] = dateArray;
          return `${year}-${String(month).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;
        }
        return ""; // Retourner une chaîne vide si la date n'est pas valide
      };

      setFormData({
        companySheetId: companySheetId,
        companyId: currentRefund.companyId || "",
        payment: currentRefund.payment || "",
        date: formatDate(currentRefund.date) || "",
      });
    }
  }, []);

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
        const response = await CreateRefundPayment(formData);
        onUpdate(formData);
        closeModal();
      } else if (modalType === "edit") {
        if (!validateForm()) return;
        const response = await EditRefundPayment(currentRefund.id, formData);
        onUpdate(response.data);
        closeModal();
      } else if (modalType === "delete") {
        const response = await DeleteRefundPayment(currentRefund.id);
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
          label={"Montant du remboursement (€)"}
          id={"payment"}
          type={"number"}
          value={formData.payment}
          onChange={handleInputChange}
          error={errors.payment}
          placeholder={"Entrer le momtant du remboursement"}
        />
      </div>
      <div>
        <InputField
          label={"Date du remboursement"}
          id={"date"}
          type={"date"}
          value={formData.date}
          onChange={handleInputChange}
          error={errors.date}
        />
      </div>
      <button type="submit">
        {currentRefund
          ? "Modifier un remboursement"
          : "Ajouter un remboursement"}
      </button>
      <i className="bx bx-plus" onClick={closeModal}></i>
    </form>
  );
};

export default RefundForm;
