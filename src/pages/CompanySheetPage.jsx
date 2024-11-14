import React, { useEffect, useState } from "react";
import CompanySheetForm from "../components/form/CompanySheetForm";
import ProjectLeaderForm from "../components/form/ProjectLeaderForm";
import {
  GetCompanySheetList,
  GetTotalByAssociation,
} from "../services/CompanySheetService";
import { GetAgreementNumber } from "../services/AgreementService";
import {
  GetAssociationListDTO,
  GetAssociationName,
} from "../services/AssociationService";
import { useParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import ModalForm from "../components/ModalForm";
import TotalLine from "../components/TotalLine";

const CompanySheetPage = () => {
  const [companySheets, setCompanySheets] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [associationName, setAssociationName] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenProjectLeaderModal, setIsOpenProjectLeaderModal] =
    useState(false);
  const [modalType, setModalType] = useState("");
  const [currentCompanySheet, setCurrentCompanySheet] = useState({});
  const [companySheetIdCreated, setCompanySheetIdCreated] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalLine, setTotalLine] = useState([]);

  const columns = [
    {
      header: "Numéro de convention de financement CDC/BPI",
      accessor: "agreementNumber",
    },
    { header: "Société", accessor: "companyName" },
    { header: "Montant engagé", accessor: "fniAmountRequested" },
    { header: "Montant versé", accessor: "fniAmountPaid" },
    {
      header: "Remboursement reçu à ce jour",
      accessor: "totalAmountRepaid",
    },
    { header: "Reste à reçevoir", accessor: "remainsToBeReceived" },
    {
      header: "Montant total des provisions",
      accessor: "totalAmountOfAccountingProvision",
    },
    { header: " Montant total des casses", accessor: "totalAmountOfDamage" },
  ];

  const modalTitle =
    {
      create: "Créer une fiche société",
      edit: "Modifier la fiche société",
      delete: "Êtes-vous sur de vouloir supprimer cet élément ?",
    }[modalType] || "Créer une fiche société"; // Valeur par défaut

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const [
          companyResponse,
          agreementsResponse,
          associationsResponse,
          associationNameResponse,
          totalResponse,
        ] = await Promise.all([
          GetCompanySheetList(id, currentPage),
          GetAgreementNumber(),
          // Vérifier je crois que je me sert même pas du GetASsociationListDTO
          GetAssociationListDTO(),
          GetAssociationName(id),
          GetTotalByAssociation(id),
        ]);

        setCompanySheets(companyResponse.data.content);
        setAgreements(agreementsResponse.data);
        setAssociations(associationsResponse.data);
        setAssociationName(associationNameResponse.data.name);
        setTotalPages(companyResponse.data.totalPages);
        setTotalLine(totalResponse.data);
        console.log(companyResponse.data);
      } catch (error) {
        setError(error.message); // Voir si il va récuéprer les deux messages si deux requête échoue ???
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [currentPage]);

  const addCompanySheetToList = (company) => {
    if (modalType === "create") {
      setCompanySheets((prev) => [...prev, company]);
    } else if (modalType === "edit") {
      setCompanySheets((prev) =>
        prev.map((comp) => (comp.id === company.id ? company : comp))
      );
    } else if (modalType === "delete") {
      setCompanySheets((prev) => prev.filter((comp) => comp.id !== company.id));
    }
  };

  const addCompanySheetId = (value) => {
    setCompanySheetIdCreated(value);
    setIsOpenProjectLeaderModal(true);
  };

  function onOpen(type, company = null) {
    setModalType(type);
    setCurrentCompanySheet(company);
    setIsOpenModal(true);
  }

  function onClose() {
    setIsOpenModal(false);
  }

  const handleEdit = (company) => {
    setCurrentCompanySheet(company);
    onOpen("edit", company);
  };

  const handleDelete = (company) => {
    onOpen("delete", company);
  };

  const renderActions = (companySheet) => (
    <>
      <a href={`/dashboard/association/${id}/companysheet/${companySheet.id}`}>
        <i className="bx bxs-right-arrow-circle"></i> Fiche société
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleEdit(companySheet);
        }}
      >
        <i className="bx bxs-edit edit"></i>
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleDelete(companySheet);
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

  const order = [
    "name",
    "",
    "totalFniRequested",
    "totalFniPaid",
    "totalFniRepaid",
    "remainsToBeReceived",
    "totalAmountOfAccountingProvision",
    "totalAmountOfDamage",
  ];

  if (isLoading) {
    return <p>Chargement des données...</p>;
  }

  if (error) {
    return <p>Une erreur est survenue : {error}</p>;
  }
  return (
    <>
      <DataTable
        title={`Tableau de suivi de l'association : ${associationName}`}
        buttonName={"Créer une société"}
        columns={columns}
        data={companySheets}
        totalPages={totalPages}
        currentPage={currentPage}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        actions={renderActions}
        openModalFunction={() => onOpen("create")}
      >
        <TotalLine data={totalLine} order={order} />
      </DataTable>
      <ModalForm
        isOpen={isOpenModal}
        onClose={onClose}
        title={modalTitle}
        children={
          <CompanySheetForm
            modalType={modalType}
            currentCompany={currentCompanySheet}
            closeModal={onClose}
            onUpdate={addCompanySheetToList}
            associations={associations}
            agreements={agreements}
            addCompanySheetId={addCompanySheetId}
          />
        }
      />
      <ModalForm
        isOpen={isOpenProjectLeaderModal}
        onClose={() => setIsOpenProjectLeaderModal(false)}
        title={"Créer un porteur de projet"}
        children={
          <ProjectLeaderForm
            modalType={"create"}
            closeModal={() => setIsOpenProjectLeaderModal(false)}
            companyIdCreated={companySheetIdCreated}
          />
        }
      />
    </>
  );
};

export default CompanySheetPage;
