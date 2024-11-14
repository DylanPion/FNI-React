import React, { useEffect, useState } from "react";
import {
  CreateCompanySheet,
  DeleteCompanySheet,
  EditCompanySheet,
} from "../../services/CompanySheetService";
import InputField from "../ui/InputField";

const CompanySheetForm = ({
  modalType,
  currentCompany,
  closeModal,
  onUpdate,
  associations,
  agreements,
  addCompanySheetId,
}) => {
  const [formData, setFormData] = useState({
    companyName: "",
    associationId: "",
    agreementId: "",
    dateOfCE: "",
    paymentMode: "one",
    amountOfTheDueDate: "",
    paymentOne: "",
    paymentOneDate: "",
    paymentTwo: "",
    paymentTwoDate: "",
    repaymentStartDate: "",
    repaymentEndDate: "",
    fniAmountRequested: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Veuillez entrer le nom de la société";
    }
    if (!formData.agreementId) {
      // Corrigé : formData au lieu de formata
      newErrors.agreementId = "Veuillez choisir une convention";
    }
    if (!formData.dateOfCE.trim()) {
      newErrors.dateOfCE = "Veuillez entrer la date du CE";
    }
    if (!formData.amountOfTheDueDate) {
      newErrors.amountOfTheDueDate = "Veuillez entrer le montant de l'échénace";
    }
    if (!formData.paymentOne) {
      newErrors.paymentOne = "Veuillez entrer le montant du premier versement";
    }
    if (!formData.paymentOneDate.trim()) {
      newErrors.paymentOneDate = "Veuillez entrer la date du premier versement";
    }
    if (!formData.repaymentStartDate.trim()) {
      newErrors.repaymentStartDate =
        "Veuillez entrer la date du début de remboursement";
    }
    if (!formData.repaymentEndDate.trim()) {
      newErrors.repaymentEndDate =
        "Veuillez entrer la date de fin de remboursement";
    }
    if (!formData.fniAmountRequested) {
      newErrors.fniAmountRequested = "Veuillez entrer le montant engagé";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (modalType === "edit" && currentCompany) {
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
        companyName: currentCompany.companyName || "",
        associationId: currentCompany.associationId || "",
        agreementId: currentCompany.agreementId || "",
        dateOfCE: formatDate(currentCompany.dateOfCE) || "", // Formatage de la date
        paymentMode: currentCompany.paymentMode || "one",
        amountOfTheDueDate: currentCompany.amountOfTheDueDate || "",
        paymentOne: currentCompany.paymentOne || "",
        paymentOneDate: formatDate(currentCompany.paymentOneDate) || "", // Formatage de la date
        paymentTwo: currentCompany.paymentTwo || "",
        paymentTwoDate: formatDate(currentCompany.paymentTwoDate) || "", // Formatage de la date
        repaymentStartDate: formatDate(currentCompany.repaymentStartDate) || "", // Formatage de la date
        repaymentEndDate: formatDate(currentCompany.repaymentEndDate) || "", // Formatage de la date
        fniAmountRequested: currentCompany.fniAmountRequested || "",
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
        const response = await CreateCompanySheet(formData);
        onUpdate(formData);
        addCompanySheetId(response.data);
        closeModal();
      } else if (modalType === "edit") {
        if (!validateForm()) return;
        const response = await EditCompanySheet(formData, currentCompany.id);
        onUpdate(response.data);
        closeModal();
      } else if (modalType === "delete") {
        const response = await DeleteCompanySheet(currentCompany.id);
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
      <InputField
        label={"Nom de la société"}
        id={"companyName"}
        type={"text"}
        value={formData.companyName}
        onChange={handleInputChange}
        error={errors.companyName}
        placeholder={"Entrer le nom de la société"}
      />
      <label htmlFor="associationId">Choisir une association</label>
      <select
        id="associationId"
        value={formData.associationId}
        onChange={handleInputChange}
      >
        <option value="" disabled>
          Liste des associations
        </option>
        {associations.map((association) => (
          <option key={association.id} value={association.id}>
            {association.name}
          </option>
        ))}
      </select>
      {errors.associationId && (
        <span className="error-message">{errors.associationId}</span>
      )}
      <label htmlFor="agreementId">Chosir une convention</label>
      <select
        id="agreementId"
        value={formData.agreementId}
        onChange={handleInputChange}
      >
        <option value="" disabled>
          Liste des conventions
        </option>
        {agreements.map((agreement) => (
          <option key={agreement.id} value={agreement.id}>
            {agreement.agreementNumber}
          </option>
        ))}
      </select>
      {errors.agreementId && (
        <span className="error-message">{errors.agreementId}</span>
      )}
      <InputField
        label={"Date du CE"}
        id={"dateOfCE"}
        type={"date"}
        value={formData.dateOfCE}
        onChange={handleInputChange}
        error={errors.dateOfCE}
      />
      <label>Mode de paiement</label>
      <div className="radio">
        <div>
          <input
            type="radio"
            id="paymentModeOne"
            name="paymentMode"
            value="one"
            checked={formData.paymentMode === "one"}
            onChange={(e) =>
              setFormData({ ...formData, paymentMode: e.target.value })
            }
          />
          <label htmlFor="paymentModeOne">Paiement en une fois</label>
        </div>
        <div>
          <input
            type="radio"
            id="paymentModeTwo"
            name="paymentMode"
            value="two"
            checked={formData.paymentMode === "two"}
            onChange={(e) =>
              setFormData({ ...formData, paymentMode: e.target.value })
            }
          />
          <label htmlFor="paymentModeTwo">Paiement en deux fois</label>
        </div>
      </div>
      <div className="amount-date-group">
        <div>
          <InputField
            label={"Premier versement (€)"}
            id={"paymentOne"}
            type={"number"}
            value={formData.paymentOne}
            onChange={handleInputChange}
            error={errors.paymentOne}
            placeholder={"Entrer le premier versement"}
          />
        </div>
        <div>
          <InputField
            label={"Date du premier versement"}
            id={"paymentOneDate"}
            type={"date"}
            value={formData.paymentOneDate}
            onChange={handleInputChange}
            error={errors.paymentOneDate}
          />
        </div>
      </div>

      {formData.paymentMode === "two" && (
        <div className="amount-date-group">
          <div>
            <InputField
              label={"Second versement (€)"}
              id={"paymentTwo"}
              type={"number"}
              value={formData.paymentTwo}
              onChange={handleInputChange}
              error={errors.paymentTwo}
              placeholder={"Entrer le second versement"}
            />
          </div>
          <div>
            <InputField
              label={"Date du second versement"}
              id={"paymentTwoDate"}
              type={"date"}
              value={formData.paymentTwoDate}
              onChange={handleInputChange}
              error={errors.paymentTwoDate}
            />
          </div>
        </div>
      )}
      <div className="date-range">
        <div>
          <InputField
            label={"Date du début de remboursement"}
            id={"repaymentStartDate"}
            type={"date"}
            value={formData.repaymentStartDate}
            onChange={handleInputChange}
            error={errors.repaymentStartDate}
          />
        </div>
        <div>
          <InputField
            label={"Date de fin de remboursemen"}
            id={"repaymentEndDate"}
            type={"date"}
            value={formData.repaymentEndDate}
            onChange={handleInputChange}
            error={errors.repaymentEndDate}
          />
        </div>
      </div>
      <InputField
        label={"Montant de l'échéance (€)"}
        id={"amountOfTheDueDate"}
        type={"number"}
        value={formData.amountOfTheDueDate}
        onChange={handleInputChange}
        error={errors.amountOfTheDueDate}
        placeholder={"Entrer le montant de l'échéance"}
      />
      <InputField
        label={"Montant engagé (€)"}
        id={"fniAmountRequested"}
        type={"number"}
        value={formData.fniAmountRequested}
        onChange={handleInputChange}
        error={errors.fniAmountRequested}
        placeholder={"Entrer le montant de engagé"}
      />
      <button type="submit">
        {modalType === "edit" ? "Modifier" : "Créer"}
      </button>
    </form>
  );
};

export default CompanySheetForm;
