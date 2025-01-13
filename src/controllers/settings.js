import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaArrowLeft, FaPenToSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../controllers/components/authContext.js";
import "../style/admin/settings.css";

import { getAuth, updateEmail, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getFirestore, doc, updateDoc, collection, where, query, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Settings() {
    const navigate = useNavigate();
    const db = getFirestore();
    const { currentUser } = useAuth();

    // Estados para los datos del formulario
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [alias, setAlias] = useState("");
    const [telefono, setTelefono] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [correo, setCorreo] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [direccion, setDireccion] = useState("");

    const [edit, setEdit] = useState();
    const [editImage, setEditImage] = useState();
    const [content, setContent] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser.level == "administrador") {
                try {
                    const q = query(
                        collection(db, "administradores"),
                        where("uid", "==", currentUser.uid)
                    );

                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();

                        setNombre(userData.adminData?.nombre || "");
                        setApellido(userData.adminData?.apellido || "");
                        setAlias(userData.adminData?.alias || "");
                        setTelefono(userData.adminData?.telefono || "");
                        setBirthDate(userData.adminData?.birthDate || "");
                        setCorreo(userData.adminCredentials?.correo || "");
                        setProfileImage(userData.adminData?.profileImage || "");
                    }
                } catch (error) {
                    toast.error("No se han encontrado ningun dato para este usuario.");
                }
            } else {
                try {
                    const q = query(
                        collection(db, "clientes"),
                        where("uid", "==", currentUser.uid)
                    );

                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();

                        setAlias(userData.ClientData?.nombre_negocio || "");
                        setTelefono(userData.ClientData?.telefono || "");
                        setCorreo(userData.Clientcredentials?.correo || "");
                        setDireccion(userData.ClientData?.direccion || "");
                        setProfileImage(userData.ClientData?.profileImage || "");
                    }
                } catch (error) {
                    toast.error("No se han encontrado ningun dato para este usuario.");
                }

            }
        };

        fetchUserData();
    }, [currentUser, db]);


    const handleDashboard = () => {
        navigate("/dashboard");
    };

    const handleUpdateImage = async () => {
        const storage = getStorage();
        const image = document.getElementById('file');
        const file = image.files[0];

        if (currentUser.level == 'administrador') {
            try {
                // Subir la imagen de perfil a Firebase Storage si hay una nueva imagen
                if (file) {
                    try {
                        // Subir imagen a Firebase Storage
                        const imageStore = ref(storage, `profilePictures/${currentUser.uid}`); // Uid del usuario no autenticado
                        await uploadBytes(imageStore, file); // Subir la imagen
                        const profileImageUrl = await getDownloadURL(imageStore);

                        try {
                            const q = query(
                                collection(db, "administradores"),
                                where("uid", "==", currentUser.uid)
                            );

                            // 2. Obtener los documentos que coincidan con la consulta
                            const querySnapshot = await getDocs(q);

                            if (!querySnapshot.empty) {
                                // 3. Recorrer los documentos encontrados (en caso de que haya más de uno)
                                querySnapshot.forEach(async (doc) => {
                                    const userDocRef = doc.ref; // Obtener la referencia del documento

                                    // 4. Actualizar el documento con la URL de la imagen
                                    await updateDoc(userDocRef, {
                                        "adminData.profileImage": profileImageUrl,
                                    });

                                });
                            }
                        } catch (error) {
                            toast.error("No se ha podido encontrar ningun usuario.");
                        }

                        // Actualizar el estado con la nueva URL de la imagen
                        setProfileImage(profileImageUrl);
                        // Se muestra un mensaje que se ha subido la imagen
                        toast.success('Imagen actualizada con éxito.');
                    } catch (error) {
                        // Se muestra  un mensaje de error que no se ha podido subir la imagen
                        toast.error('Ha ocurrido un error al subir la imagen');
                        return;
                    }
                }

                setEditImage(false)
            } catch (error) {
                toast.error("No se ha podido actualizar la imagen de perfil.");
            }
        } else {
            try {
                // Subir la imagen de perfil a Firebase Storage si hay una nueva imagen
                if (file) {
                    try {
                        // Subir imagen a Firebase Storage
                        const imageStore = ref(storage, `profilePictures/${currentUser.uid}`); // Uid del usuario no autenticado
                        await uploadBytes(imageStore, file); // Subir la imagen
                        const profileImageUrl = await getDownloadURL(imageStore);

                        try {
                            const q = query(
                                collection(db, "clientes"),
                                where("uid", "==", currentUser.uid)
                            );

                            // 2. Obtener los documentos que coincidan con la consulta
                            const querySnapshot = await getDocs(q);

                            if (!querySnapshot.empty) {
                                // 3. Recorrer los documentos encontrados (en caso de que haya más de uno)
                                querySnapshot.forEach(async (doc) => {
                                    const userDocRef = doc.ref; // Obtener la referencia del documento

                                    // 4. Actualizar el documento con la URL de la imagen
                                    await updateDoc(userDocRef, {
                                        "ClientData.profileImage": profileImageUrl,
                                    });

                                });
                            }
                        } catch (error) {
                            toast.error("No se ha podido encontrar ningun usuario.");
                        }

                        // Actualizar el estado con la nueva URL de la imagen
                        setProfileImage(profileImageUrl);
                        // Se muestra un mensaje que se ha subido la imagen
                        toast.success('Imagen actualizada con éxito.');
                    } catch (error) {
                        // Se muestra  un mensaje de error que no se ha podido subir la imagen
                        toast.error('Ha ocurrido un error al subir la imagen');
                        return;
                    }
                }

                setEditImage(false)
            } catch (error) {
                toast.error("No se ha podido actualizar la imagen de perfil.");
            }

        }

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const StartUpdateImage = () => {
        setEditImage(prevEditImage => !prevEditImage); // Cambia el estado de edición para la imagen
    }

    const startUpdate = () => {
        setEdit(prevEdit => !prevEdit); // Cambia el estado de edición
    };


    const handleUpdate = async () => {
        const auth = getAuth();
        const user = currentUser;

        if (user.level == "administrador") {
            try {
                // Si el correo ha cambiado, necesitamos reautenticar al usuario
                if (user.adminCredentials?.correo !== correo) {
                    const credential = EmailAuthProvider.credential(user.adminCredentials?.correo, currentUser.adminCredentials?.clave); // Aquí 'user_password' debe ser reemplazado con la contraseña del usuario
                    await reauthenticateWithCredential(user, credential); // Reautenticar al usuario

                    // Luego, actualizar el correo
                    await updateEmail(user, correo);
                }

                // Actualizar los datos del usuario en Firestore
                try {
                    const q = query(
                        collection(db, "administradores"),
                        where("uid", "==", currentUser.uid)
                    );

                    // 2. Obtener los documentos que coincidan con la consulta
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        // 3. Recorrer los documentos encontrados (en caso de que haya más de uno)
                        querySnapshot.forEach(async (doc) => {
                            const userDocRef = doc.ref; // Obtener la referencia del documento

                            // 4. Actualizar el documento con la URL de la imagen
                            await updateDoc(userDocRef, {
                                'adminData.nombre': nombre,
                                'adminData.apellido': apellido,
                                'adminData.alias': alias,
                                'adminData.telefono': telefono,
                                'adminData.birthDate': birthDate,
                                'adminCredentials.correo': correo,
                            });

                        });
                    }
                } catch (error) {
                    toast.error("No se ha podido encontrar ningun usuario.");
                }
                toast.success("Usuario actualizado exitosamente");
                setEdit(false); // Salir del modo de edición
            } catch (error) {
                toast.error("No se ha podido actualizar el usuario.");
            }
        } else {
            try {
                // Si el correo ha cambiado, necesitamos reautenticar al usuario
                if (user.Clientcredentials?.correo !== correo) {
                    const credential = EmailAuthProvider.credential(user.Clientcredentials?.correo, currentUser.Clientcredentials?.clave); // Aquí 'user_password' debe ser reemplazado con la contraseña del usuario
                    await reauthenticateWithCredential(user, credential); // Reautenticar al usuario

                    // Luego, actualizar el correo
                    await updateEmail(user, correo);
                }

                // Actualizar los datos del usuario en Firestore
                try {
                    const q = query(
                        collection(db, "clientes"),
                        where("uid", "==", currentUser.uid)
                    );

                    // 2. Obtener los documentos que coincidan con la consulta
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        // 3. Recorrer los documentos encontrados (en caso de que haya más de uno)
                        querySnapshot.forEach(async (doc) => {
                            const userDocRef = doc.ref; // Obtener la referencia del documento

                            // 4. Actualizar el documento con la URL de la imagen
                            await updateDoc(userDocRef, {
                                'ClientData.nombre_negocio': alias,
                                'ClientData.direccion': direccion,
                                'ClientData.telefono': telefono,
                                'Clientcredentials.correo': correo,
                                'ClientData.correo': correo,
                            });

                        });
                    }
                } catch (error) {
                    toast.error("No se ha podido encontrar ningun usuario.");
                }
                toast.success("Usuario actualizado exitosamente");
                setEdit(false); // Salir del modo de edición
            } catch (error) {
                toast.error("No se ha podido actualizar el usuario.");
            }

        }
    };


    useEffect(() => {
        switch (currentUser.level) {
            case 'administrador':
                setContent(
                    <div className="row">
                        <div className="col-xl-4">
                            <div className="card mb-4 mb-xl-0 ">
                                <div className="card-header d-flex justify-content-between">Profile Picture  <Button variant="success" onClick={StartUpdateImage}>Update picture<FaPenToSquare style={{ marginLeft: "5px" }} /></Button></div>
                                <div className="card-body text-center">
                                    <img className="img-account-profile rounded-circle" style={{ maxWidth: "175px" }} src={profileImage} alt="" />
                                    <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                                    <input type="file" id="file" accept="image/*" style={editImage ? { display: "block" } : { display: "none" }} onChange={handleImageChange} />
                                </div>
                                <Button className="btn btn-primary" style={editImage ? { display: "block" } : { display: "none" }} type="button" onClick={handleUpdateImage}>Save changes</Button>
                            </div>
                        </div>
                        <div className="col-xl-8">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between">Account Details         <Button variant="success" onClick={startUpdate}>Edit<FaPenToSquare style={{ marginLeft: "5px" }} /></Button></div>
                                <div className="card-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="small mb-1" htmlFor="inputUsername">Username (how your name will appear to other users on the site)</label>
                                            <input
                                                className="form-control"
                                                id="inputUsername"
                                                type="text"
                                                placeholder="Enter your username"
                                                value={alias}
                                                onChange={(e) => setAlias(e.target.value)}
                                                disabled={!edit}
                                            />
                                        </div>
                                        <div className="row gx-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="inputFirstName">First name</label>
                                                <input
                                                    className="form-control"
                                                    id="inputFirstName"
                                                    type="text"
                                                    placeholder="Enter your first name"
                                                    value={nombre}
                                                    onChange={(e) => setNombre(e.target.value)}
                                                    disabled={!edit}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="inputLastName">Last name</label>
                                                <input
                                                    className="form-control"
                                                    id="inputLastName"
                                                    type="text"
                                                    placeholder="Enter your last name"
                                                    value={apellido}
                                                    onChange={(e) => setApellido(e.target.value)}
                                                    disabled={!edit}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="small mb-1" htmlFor="inputEmailAddress">Email address</label>
                                            <input
                                                className="form-control"
                                                id="inputEmailAddress"
                                                type="email"
                                                placeholder="Enter your email address"
                                                value={correo}
                                                onChange={(e) => setCorreo(e.target.value)}
                                                disabled={!edit}
                                            />
                                        </div>
                                        <div className="row gx-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                                                <input
                                                    className="form-control"
                                                    id="inputPhone"
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    value={telefono}
                                                    onChange={(e) => setTelefono(e.target.value)}
                                                    disabled={!edit}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="inputBirthday">Birthday</label>
                                                <input
                                                    className="form-control"
                                                    id="inputBirthday"
                                                    type="text"
                                                    placeholder="Enter your birthday"
                                                    value={birthDate}
                                                    onChange={(e) => setBirthDate(e.target.value)}
                                                    disabled={!edit}
                                                />
                                            </div>
                                        </div>
                                        <Button className="btn btn-primary" style={edit ? { display: "block" } : { display: "none" }} type="button" onClick={handleUpdate}>Save changes</Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                break;
            default:
                setContent(
                    <div className="row">
                        <div className="col-xl-4">
                            <div className="card mb-4 mb-xl-0">
                                <div className="card-header d-flex justify-content-between">Profile Picture  <Button variant="success" onClick={StartUpdateImage}>Update picture<FaPenToSquare style={{ marginLeft: "5px" }} /></Button></div>
                                <div className="card-body text-center">
                                    <img className="img-account-profile rounded-circle" style={{ maxWidth: "175px" }} src={profileImage} alt="" />
                                    <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                                    <input type="file" id="file" accept="image/*" style={editImage ? { display: "block" } : { display: "none" }} onChange={handleImageChange} />
                                </div>
                                <Button className="btn btn-primary" style={editImage ? { display: "block" } : { display: "none" }} type="button" onClick={handleUpdateImage}>Save changes</Button>
                            </div>
                        </div>
                        <div className="col-xl-8">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between">Account Details         <Button variant="success" onClick={startUpdate}>Edit<FaPenToSquare style={{ marginLeft: "5px" }} /></Button></div>
                                <div className="card-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="small mb-1" htmlFor="inputUsername">Business name (how your name will appear to other users on the site)</label>
                                            <input
                                                className="form-control"
                                                id="inputUsername"
                                                type="text"
                                                placeholder="Enter your username"
                                                value={alias}
                                                onChange={(e) => setAlias(e.target.value)}
                                                disabled={!edit}
                                            />
                                        </div>
                                        <div className="row gx-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                                                <input
                                                    className="form-control"
                                                    id="inputPhone"
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    value={telefono}
                                                    onChange={(e) => setTelefono(e.target.value)}
                                                    disabled={!edit}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="inputEmail">Email address</label>
                                                <input
                                                    className="form-control"
                                                    id="inputEmail"
                                                    type="text"
                                                    placeholder="Enter your birthday"
                                                    value={correo}
                                                    onChange={(e) => setCorreo(e.target.value)}
                                                    disabled={!edit}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="small mb-1" htmlFor="inputUsername">Address</label>
                                                <textarea
                                                    className="form-control"
                                                    id="textAdress"
                                                    type="text"
                                                    placeholder="Enter your address"
                                                    value={direccion}
                                                    onChange={(e) => setDireccion(e.target.value)}
                                                    disabled={!edit}
                                                    style={{ maxHeight: "20vh" }}
                                                />
                                            </div>
                                        </div>
                                        <Button className="btn btn-primary" style={edit ? { display: "block" } : { display: "none" }} type="button" onClick={handleUpdate}>Save changes</Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                );;
                break;
        }
    }, [currentUser, profileImage, alias, nombre, apellido, telefono, birthDate, correo, edit, editImage, direccion]);

    return (
        <div className="overflow-y-scroll" style={{ backgroundColor: "white", height: "100vh", width: "10o%" }}>
            <div className="container-xl ">
                <Button variant="outline-secondary mt-4" onClick={handleDashboard}><FaArrowLeft /> Volver</Button>
                <hr className="mb-4" />
                <div className="main">
                    {content}
                    <div className="row">
                        <div className="col-xl-4"></div>
                        <div className="col-xl-8">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between">Preferences</div>
                                <div className="card-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="small mb-1" htmlFor="inputUsername">Idioma</label>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;