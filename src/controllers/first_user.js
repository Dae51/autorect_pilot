import React from "react";

function First() {
    return (
        <div className="signup" id="contained-signup">
            <div className="top_signup">
                <div className="logo">
                    <img src="resources/images/logo_login.png" alt="" />
                </div>
                <div className="text">
                    <h5>WELCOME TO <span>AUTORECT</span></h5>
                    <p>Creating the first user <span>.</span></p>
                </div>
                <form action="" className="first_user" id="sign_up">
                    <div className="image_user">
                        <div className="foto_user"></div>
                        <button id="pull_image">Pull photo</button>
                    </div>
                    <div className="datas_info">
                        <div className="input-data">
                            <input type="text" required />
                            <div className="underline"></div>
                            <label>Username</label>
                        </div>
                        <div className="input-data">
                            <input type="password" required />
                            <div className="underline"></div>
                            <label>Password</label>
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Lenguaje
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">ENGLISH</a></li>
                                <li><a className="dropdown-item" href="#">SPANISH LA</a></li>
                                <li><a className="dropdown-item" href="#">SPANISH ESP</a></li>
                            </ul>
                        </div>
                    </div>
                    <button id="save_first">Save</button>
                </form>
            </div>
        </div>
    );
}

export default First;