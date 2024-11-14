import React, { useEffect, useState } from "react";
import TreasuryForm from "../components/form/TreasuryForm";
import DataTable from "../components/DataTable";
import ModalForm from "../components/ModalForm";
import { GetTreasury } from "../services/AgreementService";

const TresoryPage = () => {
  const [agreementList, setAgreementList] = useState([]);
  const [total, setTotal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentAgreement, setCurrentAgreement] = useState({});

  const columns = [
    {
      header: "Numéro de convention de financement CDC/BPI",
      accessor: "agreementNumber",
    },
    { header: "Montant demandé par la CDC/BPI", accessor: "askedAmountCdcBpi" },
    {
      header: "Montant reçu par la CDC/BPI",
      accessor: "receivedAmountCdcBpi",
    },
    { header: "Montant engagé", accessor: "fniAmountRequested" },
    { header: "Montant versé", accessor: "fniAmountPaid" },
    { header: "Remboursement reçu", accessor: "sumOfRepaidAmounts" },
    {
      header: "Montant engagé et non versé",
      accessor: "committedButNotPaidAmount",
    },
    {
      header: "Montant total des casses",
      accessor: "totalDamageAmount",
    },
    {
      header: "Montant total des provisions",
      accessor: "totalProvisionAmount",
    },
    {
      header: "Trésorerie disponible",
      accessor: "availableTreasury",
    },
  ];

  const modalTitle =
    {
      create: "Créer une convention",
      edit: "Modifier la convention",
      delete: "Êtes-vous sur de vouloir supprimer cet élément ?",
    }[modalType] || "Créer une convention"; // Valeur par défaut

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await GetTreasury();
        setAgreementList(response.data);
        console.log(response.data);

        // Appeler la data
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const addAgreementToList = (agreement) => {
    if (modalType === "create") {
      const updatedList = [...agreementList, agreement]; // Correct reference
      setAgreementList(updatedList);
    } else if (modalType === "edit") {
      setAgreementList((prev) =>
        prev.map((agg) => (agg.id === agreement.id ? agreement : agg))
      );
    } else if (modalType === "delete") {
      setAgreementList((prev) => prev.filter((agg) => agg.id !== agreement.id)); // Correct filtering logic
    }
  };

  function onOpen(type, agreement = null) {
    setModalType(type);
    setCurrentAgreement(agreement);
    setIsOpenModal(true);
  }

  function onClose() {
    setIsOpenModal(false);
  }

  const handleEdit = (agreement) => {
    setCurrentAgreement(agreement);
    onOpen("edit", agreement);
  };

  const handleDelete = (agreement) => {
    onOpen("delete", agreement);
  };

  const renderActions = (agreement) => (
    <>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleEdit(agreement);
        }}
      >
        <i className="bx bxs-edit edit"></i>
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleDelete(agreement);
        }}
      >
        <i className="bx bx-trash delete"></i>
      </a>
    </>
  );

  if (isLoading) {
    return <p className="isLoading">Chargement des données...</p>;
  }

  if (error) {
    return <p className="isError">Une erreur est survenue : {error}</p>;
  }

  const order = ["name", "totalFniRequested", "totalFniPaid", "totalFniRepaid"]; // A modifier
  return (
    <>
      <DataTable
        title={"Tableau de suivi des conventions"}
        buttonName={"Créer une convention"}
        columns={columns}
        data={agreementList}
        actions={renderActions}
        openModalFunction={() => onOpen("create")}
      ></DataTable>

      <ModalForm
        isOpen={isOpenModal}
        onClose={onClose}
        title={modalTitle}
        children={
          <TreasuryForm
            modalType={modalType}
            currentAgreement={currentAgreement}
            closeModal={onClose}
            onUpdate={addAgreementToList}
          />
        }
      />
    </>
  );
};

export default TresoryPage;
