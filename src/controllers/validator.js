import React, {useState} from "react";

// Funcion para validar campos vacios
export const nullHandler = (variables) => {
    return variables.every((variable) => variable.trim() !== '');
  };

  