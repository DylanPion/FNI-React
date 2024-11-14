import React, { useEffect, useImperativeHandle, useState } from "react";
import DataTable from "../components/DataTable";
import ModalForm from "../components/ModalForm";
import {
  GetAssociationList,
  GetTotalAssociation,
} from "../services/AssociationService";
import AssociationForm from "../components/form/AssociationForm";
import TotalLine from "../components/TotalLine";

const AssociationPage = () => {
  const [associations, setAssociations] = useState([]);
  const [total, setTotal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentAssociation, setCurrentAssociation] = useState({});
  const [currentPage, setCurrentPage] = useState(0); // Page actuelle
  const [totalPages, setTotalPages] = useState(0); // Total des pages

  const columns = [
    { header: "Liste des associations", accessor: "name" },
    { header: "Montant total engagé", accessor: "totalFniAmountRequested" },
    { header: "Montant total versé", accessor: "totalFniAmountPaid" },
    {
      header: "Remboursement reçu à ce jour",
      accessor: "totalFniAmountRepaid",
    },
  ];

  const modalTitle =
    {
      create: "Créer une association",
      edit: "Modifier l'association",
      delete: "Êtes-vous sur de vouloir suppimer cet élément ?",
    }[modalType] || "Créer une association"; // Valeur par défaut

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const associationResponse = await GetAssociationList(currentPage);
        const totalResponse = await GetTotalAssociation();
        setAssociations(associationResponse.data.content);
        setTotal(totalResponse.data);
        console.log(totalResponse.data);

        setTotalPages(associationResponse.data.totalPages); // Mettre à jour le total des pages
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const addAssociationToList = (association) => {
    if (modalType === "create") {
      // Ajout d'une nouvelle association
      const associationList = [...associations, association];
      setAssociations(associationList);
      setCurrentPage(totalPages - 1);
    } else if (modalType === "edit") {
      setAssociations((prev) =>
        prev.map((assoc) => (assoc.id === association.id ? association : assoc))
      );
    } else if (modalType === "delete") {
      setAssociations((prev) =>
        prev.filter((assoc) => assoc.id !== association.id)
      );
    }
  };

  function onOpen(type, association = null) {
    setModalType(type);
    setCurrentAssociation(association); // Sauvegarde l'association actuelle
    setIsOpenModal(true);
  }

  function onClose() {
    setIsOpenModal(false);
  }

  const handleEdit = (association) => {
    setCurrentAssociation(association);
    onOpen("edit", association);
  };

  const handleDelete = (association) => {
    onOpen("delete", association);
  };

  const renderActions = (association) => (
    <>
      <a href={`/dashboard/association/${association.id}`}>
        <i className="bx bxs-right-arrow-circle"></i> Liste des sociétés
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleEdit(association);
        }}
      >
        <i className="bx bxs-edit edit"></i>
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleDelete(association);
        }}
      >
        <i className="bx bx-trash delete"></i>
      </a>
    </>
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return <p className="isLoading">Chargement des données...</p>;
  }

  if (error) {
    return <p className="isError">Une erreur est survenue : {error}</p>;
  }

  const order = ["name", "totalFniRequested", "totalFniPaid", "totalFniRepaid"];
  return (
    <>
      <DataTable
        title={"Tableau de suivi des associations"}
        buttonName={"Créer une association"}
        columns={columns}
        data={associations}
        totalPages={totalPages}
        currentPage={currentPage}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        actions={renderActions}
        openModalFunction={() => onOpen("create")}
      >
        <TotalLine data={total} order={order} />
      </DataTable>

      <ModalForm
        isOpen={isOpenModal}
        onClose={onClose}
        title={modalTitle}
        children={
          <AssociationForm
            modalType={modalType}
            currentAssociation={currentAssociation}
            closeModal={onClose}
            onUpdate={addAssociationToList}
          />
        }
      />
    </>
  );
};

export default AssociationPage;
