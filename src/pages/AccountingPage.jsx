import React, { useEffect, useState } from "react";
import { GetAccountingList } from "../services/AccountingService";
import DataTable from "../components/DataTable";
import ModalForm from "../components/ModalForm";
import AccountingForm from "../components/form/AccountingForm";

const AccountingPage = () => {
  const [accountingList, setAccountingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const columns = [
    {
      header: "Année",
      accessor: "accountingDate",
    },
    { header: "Solde 2748 au 31/12", accessor: "account2748" },
    {
      header: "Solde 4671 au 31/12",
      accessor: "account4671",
    },
    { header: "Montant total versé", accessor: "fniAmountPaid" },
    { header: "Remboursement total reçu", accessor: "totalPayment" },
    {
      header: "Montant total de la casse",
      accessor: "totalAmountOfDamage",
    },
    {
      header: "Solde théorique",
      accessor: "theoreticalBalance",
    },
    {
      header: "Solde comptable",
      accessor: "accountingBalance",
    },
    {
      header: "Différence",
      accessor: "difference",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await GetAccountingList();
        console.log(response.data);

        setAccountingList(response.data);
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

  function onOpen(type, accounting = null) {
    setModalType(type);
    setIsOpenModal(true);
  }

  function onClose() {
    setIsOpenModal(false);
  }

  if (isLoading) {
    return <p className="isLoading">Chargement des données...</p>;
  }

  if (error) {
    return <p className="isError">Une erreur est survenue : {error}</p>;
  }

  return (
    <>
      <DataTable
        title={"Suivi de la comptabilité"}
        buttonName={"Créer un pointage"}
        columns={columns}
        data={accountingList}
        openModalFunction={() => onOpen("create")}
      ></DataTable>

      <ModalForm
        isOpen={isOpenModal}
        onClose={onClose}
        children={<AccountingForm closeModal={onClose} />}
      />
    </>
  );
};

export default AccountingPage;
