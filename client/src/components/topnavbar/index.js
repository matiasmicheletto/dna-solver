import React from 'react';
import { Navbar } from 'react-bootstrap';
import logo from '../../img/logo_uns.png';
import './styles.css';

const TopNavbar = () => (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Navbar.Brand>
        <img className="logo" src={logo} alt="Logo"/>
      </Navbar.Brand>      
    </Navbar>  
)

export default TopNavbar