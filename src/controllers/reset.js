import { useState, useEffect } from "react";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import firebaseApp from "../server/server_config";

import logo from "../images/pass.png";

function Reset() {
    const auth = getAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [change, setChange] = useState(""); // Define el estado para alternar contenido

    const buttonStyle = {
        backgroundColor: '#822727',
        color: 'white',
        width: '150px',
        height: '45px',
        borderRadius: '10px',
        marginLeft: '5rem',
        border: "transparent"
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter a valid email address.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            navigate("/"); // Redirigir al usuario a la página de verificación de correo electrónico
            toast.success("Se ha enviado un correo a la direccion de la cuenta.");
        } catch {
            toast.error("Failed to send password reset email.");
        }
    };

    return (
        <div>
            <section className="py-3 py-md-5 py-xl-8">
                <div className="container h-fit-content w-fit-content" style={{ backgroundColor: "#f9f9f9", height: "85vh", maxHeight: "85vh" }}>
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10 col-xl-8">
                            <div className="row gy-5 justify-content-center mt-2">
                                <div className="col-12 col-lg-5 d-flex align-items-center" >
                                    <form onSubmit={handlePasswordReset}>
                                        <div className="row gy-3 overflow-hidden">
                                            {/* Renderizado Condicional */}
                                            {change === "pin" ? (
                                                <>
                                                    <div className="col-12">
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="email"
                                                                className="form-control border-0 border-bottom rounded-0"
                                                                name="email"
                                                                id="email"
                                                                placeholder="name@example.com"
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                required
                                                            />
                                                            <label htmlFor="email" className="form-label">Email</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="d-grid">
                                                            <button className="btn rounded-lg fs-6" type="submit">Reset Password</button>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="col-12">
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="email"
                                                                className="form-control border-0 border-bottom rounded-0"
                                                                name="email"
                                                                id="email"
                                                                placeholder="name@example.com"
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                required
                                                            />
                                                            <label htmlFor="email" className="form-label">Email</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="d-grid">
                                                            <button className="btn" style={buttonStyle} type="submit">Reset password</button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            <div className="col-12">
                                                <div className="row justify-content-between">
                                                    <div className="col-6">
                                                        <a
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => navigate('/')}
                                                            className="link-secondary text-decoration-none"
                                                        >
                                                            return to login
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-12 col-lg-1 d-flex align-items-center justify-content-center gap-3 flex-lg-column">
                                    <div className="bg-dark w-100 d-lg-none" style={{ height: "1px" }}></div>
                                    <div className="bg-dark h-100 d-none d-lg-block" style={{ width: "1px" }}></div>
                                    <div className="bg-dark w-100 d-lg-none" style={{ height: "1px" }}></div>
                                </div>
                                <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
                                    <div className="d-flex gap-3 flex-column w-100 ">
                                        <h2 className="display-5 fw-bold text-center">Forget your password ?</h2>
                                        <p className="text-center m-0">Provide the email address associated with your account to recover your password.</p>
                                        <img src={logo} alt="Password reset" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Reset;
