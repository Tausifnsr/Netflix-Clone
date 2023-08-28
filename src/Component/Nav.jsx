import React, { useState, useEffect } from "react";
import "./Nav.css";
import Netflix from "../assets/images/netflix.png";
import { useNavigate } from "react-router-dom";

function Nav() {
  const [show, handleShow] = useState(false);
  const navigate = useNavigate();

  function handleClickHome() {
    navigate("/");
  }  

  function handleClickProfile() {
    navigate("/profile");
  }

  const transitionNavbar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavbar);
    return () => window.removeEventListener("scroll", transitionNavbar);
  }, []);
  return (
    <div className={`nav ${show && "nav_black"}`}>
      <div className="nav_content">
        <img onClick={handleClickHome} className="nav_logo" src={Netflix} alt="Logo" />
        <img onClick={handleClickProfile}
          className="nav_avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png?20201013161117"
          alt="avatar"
        />
      </div>
    </div>
  );
}

export default Nav;
