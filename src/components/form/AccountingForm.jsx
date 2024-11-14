import React, { useState } from "react";
import { CreateAccount } from "../../services/AuthenticateService";
import { CreateAccounting } from "../../services/AccountingService";
import InputField from "../ui/InputField";

const AccountingForm = ({ closeModal }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    breakageHistory: "",
    accountingDate: "",
    account2748: "",
    account4671: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.accountingDate) {
      newErrors.accountingDate = "Veuillez entrer la date de la compta";
    }
    if (!formData.account2748.trim()) {
      newErrors.account2748 = "Veuillez entrer le solde cpte 2748 au 31/12";
    }
    if (!formData.account4671.trim()) {
      newErrors.account4671 = "Veuillez entrer le solde cpte 4671 au 31/12";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      if (!validateForm()) return;
      console.log(formData);

      const response = await CreateAccounting(formData); // Pass formData
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <InputField
          label={"Historique de casse, montant (Optionnel)"}
          id={"breakageHistory"}
          type={"text"}
          value={formData.breakageHistory}
          onChange={handleInputChange}
          error={errors.breakageHistory}
          placeholder={"Entrer un montant à ajouter au total actuel"}
        />
        <InputField
          label={"Date de la compta"}
          id={"accountingDate"}
          type={"date"}
          value={formData.accountingDate}
          onChange={handleInputChange}
          error={errors.accountingDate}
        />
        <InputField
          label={"Solde cpte 4671 au 31/72 (€)"}
          id={"account4671"}
          type={"number"}
          value={formData.account4671}
          onChange={handleInputChange}
          error={errors.account4671}
          placeholder={"Entrer le solde cpte 4671 au 31/12"}
        />
        <InputField
          label={"Solde cpte 2748 au 31/12 (€)"}
          id={"account2748"}
          type={"number"}
          value={formData.account2748}
          onChange={handleInputChange}
          error={errors.account2748}
          placeholder={"Entrer le solde cpte 2748 au 31/12"}
        />
      </div>
      <button type="submit">Créer un nouveau pointage</button>
      <i className="bx bx-plus" onClick={closeModal}></i>
    </form>
  );
};

export default AccountingForm;
