import React, { useState } from "react";

function Login() {
    return (
        <div className="textlogin">
            <form id="form_login" method="post" className="formlogin">
                <div className="input-data">
                    <input type="text" name="username" required />
                    <div className="underline"></div>
                    <label>Username</label>
                </div>
                <div className="input-data" id="pass">
                    <input type="password" name="clave" required />
                    <div className="underline"></div>
                    <label>Password</label>
                </div>
                <div className="endlogin">
                    <div className="forget">
                        <a>Forgot password?</a>
                    </div>
                    <div className="buttons">
                        <button id="btnlogin" type="submit">Login</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login;