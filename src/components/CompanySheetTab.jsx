import React, { useEffect, useState } from "react";
import { GetCompanySheet } from "../services/CompanySheetService";
import { useParams } from "react-router-dom";

const CompanySheetTab = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [companySheet, setCompanySheet] = useState({}); // Initialisez comme un objet
  const [isLoading, setIsLoading] = useState(false);
  const { companySheetId } = useParams();

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length === 3) {
      const [year, month, day] = dateArray;
      const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ];
      const monthName = months[month - 1];
      return `${day} ${monthName} ${year}`;
    }
    return "Date non disponible";
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return "0 €";
    } else if (typeof value === "number") {
      return new Intl.NumberFormat("fr-FR").format(value) + " €";
    } else if (typeof value === "string") {
      return value;
    }
    return value;
  };

  useEffect(() => {
    const fetchCompanySheet = async () => {
      setIsLoading(true);
      try {
        const responseCompanySheet = await GetCompanySheet(companySheetId);
        setCompanySheet(responseCompanySheet.data);
      } catch (error) {
        console.log("Erreur lors de la récupération de la société");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanySheet();
  }, [companySheetId]);

  return (
    <div className="info-card">
      {isLoading ? (
        <div className="loading-indicator">Chargement...</div>
      ) : (
        <>
          <div className="tabs">
            <button
              className={`tab-button-one ${
                activeTab === "tab1" ? "active" : ""
              }`}
              onClick={() => setActiveTab("tab1")}
            >
              Fiche sté
            </button>
            <button
              className={`tab-button-two ${
                activeTab === "tab2" ? "active" : ""
              }`}
              onClick={() => setActiveTab("tab2")}
            >
              Engagement
            </button>
            <button
              className={`tab-button-tree ${
                activeTab === "tab3" ? "active" : ""
              }`}
              onClick={() => setActiveTab("tab3")}
            >
              Versement
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "tab1" && (
              <div>
                <ul>
                  <li>
                    Nom de la société : <span>{companySheet.companyName}</span>
                  </li>
                  <li>
                    Association : <span>{companySheet.associationName}</span>
                  </li>
                  <li>
                    Année CE : <span>{formatDate(companySheet.dateOfCE)}</span>
                  </li>
                  <li>
                    Lauréats :
                    <span>
                      {/* J'ai mis cela car je pense que les donénes sont pas chargé totalement pour cette partie j'avais des problèmes avec le map pourtant j'ai bien un isLoading et il semble que le useEffect soit appelé 2x je ne sais pas pourquoi  */}
                      {Array.isArray(companySheet.projectLeaderList) &&
                      companySheet.projectLeaderList.length > 0 ? (
                        companySheet.projectLeaderList.map((leader, index) => (
                          <span key={leader.id}>
                            &nbsp;{leader.name}
                            {index < companySheet.projectLeaderList.length - 1
                              ? ", "
                              : ""}
                          </span>
                        ))
                      ) : (
                        <span> Aucun Lauréat disponible</span>
                      )}
                    </span>
                  </li>
                  <li>
                    Numéro de convention de financement CDC/BPI : &nbsp;
                    <span>{companySheet.agreementNumber}</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTab === "tab2" && (
              <div>
                <ul>
                  <li>
                    Montant engagé :{" "}
                    <span>{formatValue(companySheet.fniAmountRequested)}</span>
                  </li>
                  <li>
                    Montant de l'échéance :{" "}
                    <span>{formatValue(companySheet.amountOfTheDueDate)}</span>
                  </li>
                  <li>
                    Date du début de remboursement :{" "}
                    <span>{formatDate(companySheet.repaymentStartDate)}</span>
                  </li>
                  <li>
                    Date de fin de remboursement :{" "}
                    <span>{formatDate(companySheet.repaymentEndDate)}</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTab === "tab3" && (
              <div>
                <ul>
                  <li>
                    Date du 1er versement :{" "}
                    <span>{formatDate(companySheet.paymentOneDate)}</span>
                  </li>
                  <li>
                    Date du 2nd versement :{" "}
                    <span>{formatDate(companySheet.paymentTwoDate)}</span>
                  </li>
                  <li>
                    Montant du versement 1 :{" "}
                    <span>{formatValue(companySheet.paymentOne)}</span>
                  </li>
                  <li>
                    Montant du versement 2 :{" "}
                    <span>{formatValue(companySheet.paymentTwo)}</span>
                  </li>
                  <li>
                    Reste à verser :{" "}
                    <span>
                      {formatValue(
                        (companySheet.fniAmountRequested || 0) -
                          (companySheet.paymentOne || 0) -
                          (companySheet.paymentTwo || 0)
                      )}{" "}
                    </span>
                  </li>
                  <li>
                    Total versé :{" "}
                    <span>
                      {formatValue(
                        (companySheet.paymentOne || 0) +
                          (companySheet.paymentTwo || 0)
                      )}{" "}
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CompanySheetTab;
