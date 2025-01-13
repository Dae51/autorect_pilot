import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import firebaseApp from '../../server/server_config.js'; // Ajusta la ruta a tu archivo de configuración de Firebase
import { Button } from 'react-bootstrap';
import { FaCirclePlus, FaCircleXmark } from "react-icons/fa6";

const db = getFirestore(firebaseApp);

const DynamicSelect = ({ onSelectionChange }) => {
  const [inputs, setInputs] = useState([{ product: null, client: null, quantity: 1, price: '' }]);
  const [productOptions, setProductOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);

  // Cargar productos desde Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productosCollection = collection(db, 'productos');
        const productosSnapshot = await getDocs(productosCollection);

        const productosOptions = productosSnapshot.docs.map((doc) => ({
          value: doc.id,
          label: doc.data().productData?.nombre,
        }));

        setProductOptions(productosOptions);
      } catch (error) {
        console.error('Error al cargar las opciones de productos:', error);
      }
    };

    fetchProducts();
  }, []);

  // Cargar clientes desde Firestore
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientesCollection = collection(db, 'clientes');
        const clientesSnapshot = await getDocs(clientesCollection);

        const clientesOptions = clientesSnapshot.docs.map((doc) => ({
          value: doc.id,
          label: doc.data().ClientData?.nombre_negocio,
        }));

        setClientOptions(clientesOptions);
      } catch (error) {
        console.error('Error al cargar las opciones de clientes:', error);
      }
    };

    fetchClients();
  }, []);

  // Manejar cambios en los campos
  const handleChange = (index, field, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index][field] = value;
    setInputs(updatedInputs);

    notifyParent(updatedInputs);
  };

  // Notificar cambios al componente padre
  const notifyParent = (updatedInputs) => {
    const selectedValues = updatedInputs.map((input, idx) => ({
      producto: input.product ? `${input.product.label}` : null,
      tienda: input.client ? `${input.client.label}` : null,
      cantidad: input.quantity ? `${input.quantity}` : null,
      precio: input.price ? `${input.price}` : null,
    })).filter(item => item.producto || item.tienda || item.cantidad || item.precio);

    onSelectionChange(selectedValues);
  };

  // Agregar un nuevo select
  const handleAdd = () => {
    if (inputs.length < 6) {
      setInputs([...inputs, { product: null, client: null, quantity: 1, price: '' }]);
    }
  };

  // Eliminar un select
  const handleRemove = (index) => {
    if (inputs.length > 1) {
      const updatedInputs = [...inputs];
      updatedInputs.splice(index, 1);
      setInputs(updatedInputs);

      notifyParent(updatedInputs);
    }
  };

  return (
    <div>
      {inputs.length < 6 && (
        <Button
          variant="outline-success"
          style={{ borderRadius: "30px", marginBottom: "10px" }}
          type="button"
          onClick={handleAdd}
          disabled={inputs.length >= 5}
        >
          <FaCirclePlus size={"1rem"} />
        </Button>
      )}
      {inputs.map((input, index) => (
        <div key={index} style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <Select
              className="dropdown"
              value={input.product}
              onChange={(e) => handleChange(index, 'product', e)}
              options={productOptions}
              placeholder="Seleccione un producto"
            />
            <Select
              className="dropdown"
              value={input.client}
              onChange={(e) => handleChange(index, 'client', e)}
              options={clientOptions}
              placeholder="Seleccione un cliente"
            />
            <input
              type="number"
              value={input.quantity}
              onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value, 10))}
              min="1"
              style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
              placeholder="Cantidad"
            />
            <input
              type="text"
              value={input.price}
              onChange={(e) => handleChange(index, 'price', e.target.value)}
              style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
              placeholder="Precio"
            />
            {inputs.length > 1 && (
              <Button
                style={{ borderRadius: "30px", marginLeft: "5px" }}
                variant="outline-danger"
                type="button"
                onClick={() => handleRemove(index)}
              >
                <FaCircleXmark size={"1rem"} />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicSelect;
