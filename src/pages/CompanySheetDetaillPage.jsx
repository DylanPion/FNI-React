import React, { useEffect, useState } from "react";
import CompanySheetTab from "../components/CompanySheetTab";
import {
  GetRefundPaymentByCompany,
  GetTotalPayment,
} from "../services/RefundHistoryService";
import {
  GetTotalWeather,
  GetWeatherByCompany,
} from "../services/WeatherService";
import DataTable from "../components/DataTable";
import RefundForm from "../components/form/RefundForm";
import WeatherForm from "../components/form/WeatherForm";
import ModalForm from "../components/ModalForm";
import { useParams } from "react-router-dom";
import TotalLine from "../components/TotalLine";

const CompanySheetDetailPage = () => {
  const [weatherList, setWeatherList] = useState([]);
  const [refundList, setRefundList] = useState([]);
  const [isOpenModalRefund, setIsOpenModalRefund] = useState(false);
  const [isOpenModalWeather, setIsOpenModalWeather] = useState(false);
  const [currentRefund, setCurrentRefund] = useState();
  const [currentWeather, setCurrentWeather] = useState();
  const [modalType, setModalType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { companySheetId } = useParams();
  const [currentPageRefundHistory, setCurrentPageRefundHistory] = useState(0); // Page actuelle
  const [currentPageWeather, setCurrentPageWeather] = useState(0); // Page actuelle
  const [totalPagesRefundHistory, setTotalPagesRefundHistory] = useState(0); // Total des pages
  const [totalPagesWeather, setTotalPagesWeather] = useState(0); // Total des pages
  const [totalLineRefund, setTotalLineRefund] = useState();
  const [totalLineWeather, setTotalLineWeather] = useState();

  const columnsRefund = [
    {
      header: "Date des rembrts",
      accessor: "date",
    },
    {
      header: "Montants reçus",
      accessor: "payment",
    },
  ];

  const columnsWeather = [
    {
      header: "Année météo",
      accessor: "weatherYear",
    },
    {
      header: "Dernier jour de l'année",
      accessor: "dateOfTheLastDayOfTheYear",
    },
    {
      header: "Nbre impayés",
      accessor: "unpaidNumber",
    },
    {
      header: "Echelle évaluation",
      accessor: "assessmentScale",
    },
    {
      header: "%Tage provision",
      accessor: "retainerPercentage",
    },
    {
      header: "Liquidation",
      accessor: "loanStatus",
    },
    {
      header: "Date de liquidation",
      accessor: "liquidationDate",
    },
    {
      header: "Garantie déclenchée",
      accessor: "bpiGuarantee",
    },
    {
      header: "Commentaire",
      accessor: "comment",
    },
    {
      header: "Montant de la provision comptable",
      accessor: "amountOfAccountingProvision",
    },
    {
      header: "Montant de la casse",
      accessor: "amountOfDamage",
    },
  ];

  const modalTitleRefund =
    {
      create: "Créer un remboursement",
      edit: "Modifier le remboursement",
      delete: "Êtes-vous sur de vouloir supprimer cet élément ?",
    }[modalType] || "Créer un remboursement "; // Valeur par défaut

  const modalTitleWeather =
    {
      create: "Créer une météo",
      edit: "Modifier la météo",
      delete: "Êtes-vous sur de vouloir supprimer cet élément ?",
    }[modalType] || "Créer une météo"; // Valeur par défaut

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const [refundResponse, weatherResponse, totalPayment, totalWeather] =
          await Promise.all([
            GetRefundPaymentByCompany(companySheetId, currentPageRefundHistory),
            GetWeatherByCompany(companySheetId, currentPageWeather),
            GetTotalPayment(companySheetId),
            GetTotalWeather(companySheetId),
          ]);
        setRefundList(refundResponse.data.content);
        setWeatherList(weatherResponse.data.content);
        setTotalPagesWeather(weatherResponse.data.totalPages);
        setTotalPagesRefundHistory(refundResponse.data.totalPages);
        setTotalLineRefund(totalPayment.data);
        setTotalLineWeather(totalWeather.data);
        console.log(totalWeather);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [companySheetId, currentPageRefundHistory, currentPageWeather]);

  const addRefundToList = (refund) => {
    if (modalType === "create") {
      setRefundList((prev) => [...prev, refund]);
    } else if (modalType === "edit") {
      setRefundList((prev) =>
        prev.map((ref) => (ref.id === refund.id ? refund : ref))
      );
    } else if (modalType === "delete") {
      setRefundList((prev) => prev.filter((ref) => ref.id !== refund.id));
    }
  };

  const addWeatherToList = (weather) => {
    if (modalType === "create") {
      setWeatherList((prev) => [...prev, weather]);
    } else if (modalType === "edit") {
      setWeatherList((prev) =>
        prev.map((wea) => (wea.id === weather.id ? weather : wea))
      );
    } else if (modalType === "delete") {
      setWeatherList((prev) => prev.filter((wea) => wea.id !== weather.id));
    }
  };

  function onOpenRefund(type, refund = null) {
    setModalType(type);
    setCurrentRefund(refund);
    setIsOpenModalRefund(true);
  }

  function onOpenWeather(type, weather = null) {
    setModalType(type);
    setCurrentWeather(weather);
    setIsOpenModalWeather(true);
  }

  function onCloseWeather() {
    setIsOpenModalWeather(false);
  }

  function onCloseRefund() {
    setIsOpenModalRefund(false);
  }

  const handleEditRefund = (refund) => {
    setCurrentRefund(refund);
    onOpenRefund("edit", refund);
  };

  const handleDeleteRefund = (refund) => {
    onOpenRefund("delete", refund);
  };

  const handleEditWeather = (weather) => {
    setCurrentWeather(weather);
    onOpenWeather("edit", weather);
  };

  const handleDeleteWeather = (weather) => {
    onOpenWeather("delete", weather);
  };

  const renderActionsRefund = (refund) => (
    <>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleEditRefund(refund);
        }}
      >
        <i className="bx bxs-edit edit"></i>
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleDeleteRefund(refund);
        }}
      >
        <i className="bx bx-trash delete"></i>
      </a>
    </>
  );

  const renderActionsWeather = (weather) => (
    <>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleEditWeather(weather);
        }}
      >
        <i className="bx bxs-edit edit"></i>
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleDeleteWeather(weather);
        }}
      >
        <i className="bx bx-trash delete"></i>
      </a>
    </>
  );

  const handleNextPageRefundHistory = () => {
    if (currentPageRefundHistory < totalPagesRefundHistory - 1) {
      setCurrentPageRefundHistory(currentPageRefundHistory + 1);
    }
  };

  const handlePreviousPageRefundHistory = () => {
    if (currentPageRefundHistory > 0) {
      setCurrentPageRefundHistory(currentPageRefundHistory - 1);
    }
  };

  const handleNextPageWeather = () => {
    if (currentPageWeather < totalPagesWeather - 1) {
      setCurrentPageWeather(currentPageWeather + 1);
    }
  };

  const handlePreviousPageWeather = () => {
    if (currentPageWeather > 0) {
      setCurrentPageWeather(currentPageWeather - 1);
    }
  };

  if (isLoading) {
    return <p>Chargement des données...</p>;
  }

  // if (error) {
  //   return <p>Une erreur est survenue : {error}</p>;
  // }

  const orderRefund = ["name", "payments", ""];
  const orderWeather = [
    "name",
    "",
    "unpaidNumber",
    "",
    "",
    "",
    "",
    "",
    "",
    "amountOfAccountingProvision",
    "amountOfDamage",
  ];

  return (
    <div className="detailCompany">
      <CompanySheetTab />
      <DataTable
        title={"Table de suivi des remboursements"}
        buttonName={"Créer un remboursement"}
        columns={columnsRefund}
        data={refundList}
        totalPages={totalPagesRefundHistory}
        currentPage={currentPageRefundHistory}
        onNextPage={handleNextPageRefundHistory}
        onPreviousPage={handlePreviousPageRefundHistory}
        actions={renderActionsRefund}
        openModalFunction={() => onOpenRefund("create")}
      >
        <TotalLine data={totalLineRefund} order={orderRefund} />
      </DataTable>
      <ModalForm
        isOpen={isOpenModalRefund}
        onClose={onCloseRefund}
        title={modalTitleRefund}
        children={
          <RefundForm
            modalType={modalType}
            currentRefund={currentRefund}
            closeModal={onCloseRefund}
            onUpdate={addRefundToList}
          />
        }
      />
      <DataTable
        title={"Table de suivi de la météo"}
        buttonName={"Créer une météo"}
        columns={columnsWeather}
        data={weatherList}
        totalPages={totalPagesWeather}
        currentPage={currentPageWeather}
        onNextPage={handleNextPageWeather}
        onPreviousPage={handlePreviousPageWeather}
        actions={renderActionsWeather}
        openModalFunction={() => onOpenWeather("create")}
      >
        <TotalLine data={totalLineWeather} order={orderWeather} />
      </DataTable>
      <ModalForm
        isOpen={isOpenModalWeather}
        onClose={onCloseWeather}
        title={modalTitleWeather}
        children={
          <WeatherForm
            modalType={modalType}
            currentWeather={currentWeather}
            closeModal={onCloseWeather}
            onUpdate={addWeatherToList}
          />
        }
      />
    </div>
  );
};

export default CompanySheetDetailPage;
