import { Button } from "react-bootstrap"

import React, { useState } from 'react';

import { FaCircleXmark, FaCirclePlus } from "react-icons/fa6";

const DynamicInput = () => {
  const [inputs, setInputs] = useState([{ value: '' }]);

  const handleChange = (index, event) => {
    const values = [...inputs];
    values[index].value = event.target.files[0]; // Asegúrate de capturar el archivo correctamente
    setInputs(values);
  };

  const handleAdd = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { value: '' }]);
    }
  };

  const handleRemove = (index) => {
    if (inputs.length > 1) {
      const values = [...inputs];
      values.splice(index, 1);
      setInputs(values);
    }
  };

  return (
    <div>
      <Button
        variant="outline-success"
        style={{ borderRadius: "30px", marginBottom: "10px" }}
        type="button"
        onClick={handleAdd}
        disabled={inputs.length >= 5} // Desactiva el botón si ya hay 5 inputs
      >
        <FaCirclePlus
          size={"1rem"}
        />
      </Button>

      {inputs.map((input, index) => (
        <div key={index} style={{ display: "flex" }}>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleChange(index, event)}
            required
          />
          {inputs.length > 1 && (
            <Button style={{ borderRadius: "30px", marginLeft: "5px" }} variant="outline-danger" type="button" onClick={() => handleRemove(index)}>
              <FaCircleXmark
                size={"1rem"}
              />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicInput;
