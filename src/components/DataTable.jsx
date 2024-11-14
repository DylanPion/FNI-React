import React, { useEffect } from "react";

const DataTable = ({
  title,
  buttonName,
  columns,
  data,
  actions,
  openModalFunction,
  totalPages,
  currentPage,
  onNextPage,
  onPreviousPage,
  children,
}) => {
  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return "0 €"; // COMMENTER CETTE LIGNE VOIR LE BUG ASSOCIATION LORS DE L'AJOUT POUR VOIR SI LE SOUCIS VIENT DE L'API
    } else if (typeof value === "number") {
      return new Intl.NumberFormat("fr-FR").format(value) + " €";
    } else if (Array.isArray(value) && value.length === 3) {
      const [year, month, day] = value;
      return `${String(day).padStart(2, "0")}-${String(month).padStart(
        2,
        "0"
      )}-${year}`;
    } //else if (typeof value === "string" && !isNaN(Date.parse(value))) {
    //   const date = new Date(value);
    //   const day = String(date.getDate()).padStart(2, "0");
    //   const month = String(date.getMonth() + 1).padStart(2, "0");
    //   const year = date.getFullYear();
    //   return `${day}-${month}-${year}`;
    // }
    return value;
  };

  return (
    <div className="table">
      <div className="table-header">
        <h2>{title}</h2>
        <button className="btn-modal" onClick={openModalFunction}>
          {buttonName}
        </button>
      </div>
      {data.length === 0 ? (
        <h2>Le tableau ne contient pas de donnée</h2>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor}>{col.header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.accessor}>{formatValue(item[col.accessor])}</td>
                ))}
                {actions && <td>{actions(item)}</td>}
              </tr>
            ))}
            {children}
          </tbody>
        </table>
      )}
      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={onPreviousPage} disabled={currentPage === 0}>
          Précédent
        </button>
        <span>
          Page {currentPage + 1} sur {totalPages}
        </span>
        <button onClick={onNextPage} disabled={currentPage >= totalPages - 1}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export default DataTable;
