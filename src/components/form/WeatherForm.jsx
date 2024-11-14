import React, { useEffect, useState } from "react";
import {
  CreateWeather,
  DeleteWeather,
  EditWeather,
} from "../../services/WeatherService";
import { useParams } from "react-router-dom";
import InputField from "../ui/InputField";

const WeatherForm = ({ modalType, currentWeather, closeModal, onUpdate }) => {
  const { companySheetId } = useParams();
  const [formData, setFormData] = useState({
    companySheetId: companySheetId,
    weatherYear: "",
    dateOfTheLastDayOfTheYear: "",
    unpaidNumber: "",
    assessmentScale: "",
    retainerPercentage: "",
    loanStatus: "",
    liquidationDate: "",
    bpiGuarantee: "",
    comment: "",
    amountOfDamage: "",
    amountOfAccountingProvision: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.weatherYear) {
      newErrors.weatherYear = "Veuillez entrer l'année météo";
    }
    if (!formData.dateOfTheLastDayOfTheYear) {
      newErrors.dateOfTheLastDayOfTheYear =
        "Veuillez entrer le dernier jour de l'année ";
    }
    if (!formData.unpaidNumber) {
      newErrors.unpaidNumber = "Veuillez entrer le nombre d'impayés ";
    }
    if (!formData.assessmentScale) {
      newErrors.assessmentScale = "Veuillez entrer l'échelle d'évaluation ";
    }
    if (!formData.retainerPercentage) {
      newErrors.retainerPercentage =
        "Veuillez entrer le pourcentage provision ";
    }
    if (!formData.loanStatus) {
      newErrors.loanStatus = "Veuillez entrer le statut du prêt ";
    }
    if (!formData.liquidationDate) {
      newErrors.liquidationDate = "Veuillez entrer la date de liquidation ";
    }
    if (!formData.bpiGuarantee) {
      newErrors.bpiGuarantee = "Veuillez entrer une garantie bpi ";
    }
    if (!formData.comment) {
      newErrors.comment = "Veuillez entrer un commenaire ";
    }
    if (!formData.amountOfDamage) {
      newErrors.amountOfDamage = "Veuillez entrer le montant de la casse ";
    }
    if (!formData.amountOfAccountingProvision) {
      newErrors.amountOfAccountingProvision =
        "Veuillez entrer le montant de la provision ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (modalType === "edit" && currentWeather) {
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
        weatherYear: formatDate(currentWeather.weatherYear) || "",
        dateOfTheLastDayOfTheYear:
          formatDate(currentWeather.dateOfTheLastDayOfTheYear) || "",
        unpaidNumber: currentWeather.unpaidNumber || "",
        assessmentScale: currentWeather.assessmentScale || "",
        retainerPercentage: currentWeather.retainerPercentage || "",
        loanStatus: currentWeather.loanStatus || "",
        liquidationDate: formatDate(currentWeather.liquidationDate) || "",
        bpiGuarantee: currentWeather.bpiGuarantee || "",
        comment: currentWeather.comment || "",
        amountOfDamage: currentWeather.amountOfDamage || "",
        amountOfAccountingProvision:
          currentWeather.amountOfAccountingProvision || "",
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
        const response = await CreateWeather(formData);
        onUpdate(formData);
        closeModal();
        //addCompanySheetId(response.data);
      } else if (modalType === "edit") {
        if (!validateForm()) return;
        const response = await EditWeather(currentWeather.id, formData);
        onUpdate(response.data);
        closeModal();
      } else if (modalType === "delete") {
        console.log(currentWeather);

        console.log(currentWeather.id);

        const response = await DeleteWeather(currentWeather.id);
        onUpdate(response.data);
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
          label={"Année de la météo"}
          id={"weatherYear"}
          type={"date"}
          value={formData.weatherYear}
          onChange={handleInputChange}
          error={errors.weatherYear}
        />
      </div>
      <div>
        <InputField
          label={"Dernier jour de l'année"}
          id={"dateOfTheLastDayOfTheYear"}
          type={"date"}
          value={formData.dateOfTheLastDayOfTheYear}
          onChange={handleInputChange}
          error={errors.dateOfTheLastDayOfTheYear}
        />
      </div>
      <div>
        <InputField
          label={"Nombre d'impayés"}
          id={"unpaidNumber"}
          type={"number"}
          value={formData.unpaidNumber}
          onChange={handleInputChange}
          error={errors.unpaidNumber}
          placeholder={"Entrer le nombre d'impayés"}
        />
      </div>
      <div>
        <InputField
          label={"Échelle d'évaluation"}
          id={"assessmentScale"}
          type={"number"}
          value={formData.assessmentScale}
          onChange={handleInputChange}
          error={errors.assessmentScale}
          placeholder={"Entrer l'échelle d'évaluation"}
        />
      </div>
      <div>
        <InputField
          label={"Pourcentage provision (%)"}
          id={"retainerPercentage"}
          type={"number"}
          value={formData.retainerPercentage}
          onChange={handleInputChange}
          error={errors.retainerPercentage}
          placeholder={"Entrer le pourcentage provision"}
        />
      </div>
      <div>
        <label htmlFor="loanStatut">Statut du prêt</label>
        <select
          name="loanStatus"
          id="loanStatus"
          value={formData.loanStatus}
          onChange={handleInputChange}
        >
          <option value="">Sélectionner un statut</option>
          ajoutée
          <option value="Engagé">Engagé</option>
          <option value="Recouvrement">Recouvrement</option>
          <option value="Contentieux">Contentieux</option>
          <option value="Clôture avec perte">Clôture avec perte</option>
          <option value="Liquidation">Liquidation</option>
        </select>
        {errors.loanStatus && (
          <span className="error-message">{errors.loanStatus}</span>
        )}
      </div>
      <div>
        <InputField
          label={"Date de liquidation"}
          id={"liquidationDate"}
          type={"date"}
          value={formData.liquidationDate}
          onChange={handleInputChange}
          error={errors.loanStatus}
          placeholder={"Entrer la date de liquidation"}
        />
      </div>
      <div>
        <label htmlFor="bpiGuarantee">Garantie BPI</label>
        <select
          name="guarantee"
          id="bpiGuarantee"
          value={formData.bpiGuarantee}
          onChange={handleInputChange}
        >
          <option value="">Chosir la garantie</option>
          <option value="Oui">Oui</option>
          <option value="Non">Non</option>
        </select>
        {errors.bpiGuarantee && (
          <span className="error-message">{errors.bpiGuarantee}</span>
        )}
      </div>
      <div>
        <InputField
          label={"Commentaire"}
          id={"comment"}
          type={"text"}
          value={formData.comment}
          onChange={handleInputChange}
          error={errors.comment}
          placeholder={"Entrer un commentaire"}
        />
      </div>
      <div>
        <InputField
          label={"Montant de la casse (€)"}
          id={"amountOfDamage"}
          type={"number"}
          value={formData.amountOfDamage}
          onChange={handleInputChange}
          error={errors.amountOfDamage}
          placeholder={"Entrer le montant de la casse"}
        />
      </div>
      <div>
        <InputField
          label={"Montant de la provision (€)"}
          id={"amountOfAccountingProvision"}
          type={"number"}
          value={formData.amountOfAccountingProvision}
          onChange={handleInputChange}
          error={errors.amountOfAccountingProvision}
          placeholder={"Entrer le montant de la provision"}
        />
      </div>
      <button type="submit">
        {currentWeather ? "Modifier la météo" : "Créer une météo"}
      </button>
      <i className="bx bx-plus" onClick={closeModal}></i>
    </form>
  );
};

export default WeatherForm;
