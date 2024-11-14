import React from "react";

const TotalLine = ({ data, order }) => {
  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return "0 €";
    } else if (typeof value === "number") {
      return new Intl.NumberFormat("fr-FR").format(value) + " €";
    } else if (Array.isArray(value) && value.length === 3) {
      const [year, month, day] = value;
      return `${String(day).padStart(2, "0")}-${String(month).padStart(
        2,
        "0"
      )}-${year}`;
    } else if (typeof value === "string" && !isNaN(Date.parse(value))) {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return value;
  };

  // Si aucune propriété order n'est fournie, utiliser l'ordre par défaut des clés
  const displayOrder = order || Object.keys(data);

  return (
    <tr className="totalLine">
      {displayOrder.map((key, index) => {
        // Vérifier si la clé est une chaîne vide et rendre une cellule vide dans ce cas
        if (key === "") {
          return <td key={index}></td>;
        }
        return <td key={index}>{formatValue(data[key])}</td>;
      })}
      <td></td>
    </tr>
  );
};

export default TotalLine;
