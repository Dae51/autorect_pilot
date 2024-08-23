import React, {useState} from "react";
import toast from 'react-hot-toast';

// Funcion para validar datos de tipo string
export function validateString(str, options = {}) {
  const {
    required = true,
    minLength = 0,
    maxLength = Infinity,
    pattern = null,
    forbiddenChars = "",
  } = options;

  const errors = [];

  // Validar si es requerido y no está vacío
  if (required && (!str || str.trim() === "")) {
    toast.error(`El campo: ${str} es obligatorio.`);
    return null;
  }

  // Validar la longitud mínima
  if (str && str.length < minLength) {
    toast.error(`La longitud mínima es de ${minLength} caracteres.`);
    return null;
  }

  // Validar la longitud máxima
  if (str && str.length > maxLength) {
    toast.error(`La longitud máxima es de ${maxLength} caracteres.`);
    return null;
  }

  // Validar el patrón
  if (str && pattern && !pattern.test(str)) {
    toast.error("El formato de la cadena no es válido.");
    return null;
  }

  // Validar caracteres prohibidos
  if (str && forbiddenChars) {
    const forbiddenRegex = new RegExp(`[${forbiddenChars}]`);
    if (forbiddenRegex.test(str)) {
      toast.error(`La cadena contiene caracteres no permitidos: ${forbiddenChars}`);
      return null;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

  