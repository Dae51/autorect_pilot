import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, setDoc, addDoc, Firestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from '../server/server_config';

import { Button, Dropdown, Modal, Table } from "react-bootstrap"
import toast from "react-hot-toast";
import { FaMagnifyingGlass, FaCirclePlus, FaArrowUpRightFromSquare, FaPrint, FaFilePen, FaFileCircleMinus, FaFileCircleQuestion, FaXmark, FaEyeSlash } from "react-icons/fa6"

import { validateString } from "./validator";
import "../style/admin/menu.css"
import "../style/admin/main.css"

const db = getFirestore(firebaseApp);
const storage = getStorage();
const auth = getAuth();

function Admin() {

    const filters = {
        borderRadius: "30px",
        backgroundColor: "white",
        color: "black",
        border: "2px solid #D2D2D2",
        marginLeft: "3px"
    }

    const [data, setData] = useState([]);
    const [numDocs, setNumDocs] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [modalState, setModalState] = useState(null);
    const [imageFile, setImageFile] = useState(null);


    const [username, setUsernamme] = useState();
    const [nombre, setNombre] = useState();
    const [apellido, setApellido] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [telefono, setTelefono] = useState();
    const [direccion, setDireccion] = useState();
    const [Dui, setDui] = useState();
    const [birthDate, setBirthDate] = useState();
    /*     const [imageURL, setImageURL] = useState();
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "administradores"));
                const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setData(docsData);
                setNumDocs(querySnapshot.size);
                if (numDocs < 10) {
                    setNumDocs(`0${querySnapshot.size}`);
                } else {
                    setNumDocs(querySnapshot.size);
                };
            } catch (error) {
                toast.error("No se han podido cargar los datos de la tabla:", error);
            };
        };


        fetchData();
    }, [])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);  // Para mostrar la imagen en un `div`
                setImageFile(file);  // Guardar el archivo en el estado
            };
            reader.readAsDataURL(file);
        }
    };

    const handleShow = (content) => {
        setModalState(content);
        setShowModal('true');
    }

    async function handleInsert(e) {
        e.preventDefault();
        if (validateString(username, {
            required: true,
            minLength: 5,
            maxLength: 15,
            pattern: /^[a-zA-Z0-9]*$/,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(nombre, {
            required: true,
            minLength: 3,
            maxLength: 10,
            pattern: /^[a-zA-Z0-9]*$/,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(apellido, {
            required: true,
            minLength: 3,
            maxLength: 10,
            pattern: /^[a-zA-Z0-9]*$/,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(password, {
            required: true,
            minLength: 8,
            maxLength: 10,
            pattern: null,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(email, {
            required: true,
            minLength: 5,
            maxLength: 50,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(telefono, {
            required: true,
            minLength: 7,
            maxLength: 15,
            pattern: /^\d{4}-[0-9]{4}$/,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(direccion, {
            required: true,
            minLength: 10,
            maxLength: 150,
            pattern: null,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(Dui, {
            required: true,
            minLength: 10,
            maxLength: 10,
            pattern: /^\d{8}-\d$/,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(birthDate, {
            required: true,
            minLength: 10,
            maxLength: 10,
            pattern: null,
            forbiddenChars: null
        }) && imageSrc) {
            try {
                // Crear usuario en Firebase Authentication
                const createUser = await createUserWithEmailAndPassword(auth, email, password);
                const uid = createUser.user.uid;

                // Subir imagen a Firebase Storage
                const imageStore = ref(storage, `profilePictures/${uid}`);
                await uploadBytes(imageStore, imageFile);
                const url = await getDownloadURL(imageStore);

                // Preparar datos del usuario
                let adminData = {
                    alias: username,
                    nombre: nombre,
                    apellido: apellido,
                    telefono: telefono,
                    direccion: direccion,
                    dui: Dui,
                    birthDate: birthDate,
                    profileImage: url
                };

                let adminCredentials = {
                    correo: email,
                    clave: password,
                };

                // Guardar los datos del usuario en Firestore
                await addDoc(collection(db, 'administradores'), {
                    adminData,
                    adminCredentials,
                    uid: uid
                });

                toast.success('Usuario creado exitosamente');
                setShowModal(false);
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    toast.error('El correo ya está en uso.');
                } else if (error.code === 'auth/invalid-email') {
                    toast.error('El correo no es válido.');
                } else if (error.code === 'auth/weak-password') {
                    toast.error('La contraseña es muy débil.');
                }
            };
        } else {
            toast.error('No se ha podido crear el usuario.');
        };
    };

    const handleModal = () => {
        switch (modalState) {
            case 'insert':
                return <div style={{ display: "flex" }} >
                    <div class="section1">
                        <input type="number" name="id" id="id"></input>
                        <div class="row">
                            <div class="col">
                                <div class="input-data">
                                    <input type="text" id="alias" name="alias" onChange={(e) => setUsernamme(e.target.value)} required />
                                    <div class="underline"></div>
                                    <label>Nombre de usuario</label>
                                </div>
                            </div>
                            <div class="col">
                                <div class="input-data">
                                    <input type="text" id="nombre" name="nombre" onChange={(e) => setNombre(e.target.value)} required />
                                    <div class="underline"></div>
                                    <label>Nombre</label>
                                </div>
                            </div>
                            <div class="col">
                                <div class="input-data">
                                    <input type="text" id="apellido" name="apellido" onChange={(e) => setApellido(e.target.value)} required />
                                    <div class="underline"></div>
                                    <label>Apellido</label>
                                </div>
                            </div>
                            <div class="col">
                                <div class="input-data">
                                    <input type="password" id="clave" name="clave" onChange={(e) => setPassword(e.target.value)} required />
                                    <div class="underline"></div>
                                    <label>Contraseña</label>
                                </div>
                            </div>
                            <div class="col">
                                <div class="input-data">
                                    <input type="mail" id="correof" name="correo" onChange={(e) => setEmail(e.target.value)} required />
                                    <div class="underline"></div>
                                    <label>Correo</label>
                                </div>
                            </div>
                            <div class="col">
                                <div class="input-data">
                                    <input type="text" id="dui" name="dui" onChange={(e) => setDui(e.target.value)} required />
                                    <div class="underline"></div>
                                    <label>DUI</label>
                                </div>
                            </div>
                            <div class="col">
                                <div class="input-data">
                                    <input type="text" id="telefono" name="telefono" onChange={(e) => setTelefono(e.target.value)} required />
                                    <div class="underline"></div>
                                    <label>Numero de telefono</label>
                                </div>
                            </div>
                            <div class="col">
                                <div class="input-data">
                                    <input type="date" name="fecha_nacimiento" onChange={(e) => setBirthDate(e.target.value)} id="fecha" min="2006-01=01" />
                                    <div class="underline"></div>
                                    <label>Fecha de nacimiento</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="section2" style={{ marginRight: "30px" }}>
                        <img src={(document.getElementById('file') === null) ? null : imageSrc} className="imagen"></img>
                        <div class="btns">
                            <input type="file" name="imageUser" id="file" accept="image/*" onChange={handleImageChange}></input>
                        </div>
                        <div class="row" style={{ marginTop: "50px" }}>
                            <div class="col">
                                <div class="input-group">
                                    <label>Direccion</label>
                                    <textarea style={{ maxHeight: "23vh", marginLeft: "10px" }} class="form-control" aria-label="With textarea" id="direccion" name="direccion" onChange={(e) => setDireccion(e.target.value)} required></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
            case 'update':

                return;
            case 'show':

                return
            default:

                return
        }
    }

    return (
        <div>
            <div className="topmain" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="text">
                    <p>USERS | ADMINS</p>
                </div>
                <div className="buttonstop">
                    <Button className="stop" data-tooltip="btnprueba" style={filters}>Export  <FaArrowUpRightFromSquare style={{ marginLeft: "3px", marginRight: "3px", marginBottom: "3px" }} /></Button>
                    <Button className="stop" style={filters}>Print <FaPrint style={{ marginRight: "3px", marginLeft: "3px", marginBottom: "3px" }} /></Button>
                    <Button type="button" id="red" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleShow('insert')} style={{ width: "auto", marginLeft: "3px" }}>
                        <FaCirclePlus style={{ marginRight: "5px", marginBottom: "3px" }} />New User
                    </Button>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal('false')} backdrop="static" size='lg'>
                <Modal.Header style={{ display: "flex", justifyContent: "space-between" }}>
                    <Modal.Title>Manage admin's</Modal.Title>
                    <Button onClick={() => setShowModal(false)} style={{ backgroundColor: "white", color: "#636363", border: "none" }}>
                        <FaXmark size={"1.3rem"} />
                    </Button>
                </Modal.Header>
                <Modal.Body style={{ height: "auto" }}>
                    <form id='adminInfo'onSubmit={handleInsert}>
                        {handleModal()}
                        <Modal.Footer style={{marginTop:"1.5rem"}}>
                            <Button type='submit' variant="secondary">
                                Save Changes
                            </Button>
                            <Button variant="info" style={{ color: "white" }}>
                                Clean up
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
            <div className="searchsection">
                <form className="search" id="form-search" method="post">
                    <button type="submit" className="button-search" style={{ marginLeft: "20px" }}><FaMagnifyingGlass size={"1.5rem"} style={{ marginTop: "10px" }} /></button>
                    <input type="text" name="search" placeholder="Username..." style={{ marginLeft: "23px" }} />
                </form>
                <div className="buttonsearch">
                    <input type="date" className="btnfilter sm-disable" />
                    <Dropdown>
                        <Dropdown.Toggle style={filters}>
                            Status
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle style={filters}>
                            Address
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle style={filters}>
                            Date
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button style={filters}>Save filters</Button>
                </div>
            </div>
            <div className="filtertable">
                <button className="active">All users <span>{numDocs}</span></button>
                <button>Disabled users <span>03</span></button>
            </div>
            <div className="datatable">
                <div className="infodatatable">
                    <p>Showing 21-30 of {numDocs} results</p>
                </div>
                <div className="numbersdata">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">1</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">2</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">3</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="itemstable">
                    <p>Items per page <span>10</span></p>
                </div>
            </div>
            <div className="sectiontable">
                <div className=" table-responsive" style={{ marginRight: "10px" }}>
                    <Table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Mail</th>
                                <th scope="col">Password</th>
                                <th scope="col">UID</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.adminCredentials?.correo}</td>
                                    <td>
                                        {'•'.repeat(item.adminCredentials?.clave.length)}
                                    </td>
                                    <td>{item.uid}</td>
                                    <td style={{ display: "flex", justifyContent: "space-evenly" }}>
                                        <Button variant='outline-warning' title='Editar usuario'><FaFilePen size={"1.3rem"} onClick={() => handleShow('update')} /></Button>
                                        <Button variant='outline-danger' title='Eliminar usuario'><FaFileCircleMinus size={"1.3rem"} /></Button>
                                        <Button variant='outline-success' title='Consultar datos'><FaFileCircleQuestion size={"1.3rem"} onClick={() => handleShow('show')} /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default Admin;