import React, { useEffect, useRef } from "react";

const ModalForm = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  // Fonction pour fermer le modal quand on clique sur la zone de fond (overlay)
  const handleClickOutside = (event) => {
    if (modalRef.current && event.target === modalRef.current) {
      onClose(); // Ferme le modal si on clique à l'extérieur
    }
  };

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  return (
    isOpen && (
      <dialog ref={modalRef} className="modal" onClick={handleClickOutside}>
        <div className="modal-content">
          <h2>{title}</h2>
          {children}
          <i className="bx bx-plus" onClick={onClose}></i>
        </div>
      </dialog>
    )
  );
};

export default ModalForm;
