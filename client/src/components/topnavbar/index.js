import React from 'react';
import { Navbar } from 'react-bootstrap';
import logo from '../../img/logo_uns.png';

const TopNavbar = () => (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Navbar.Brand>
        <img src={logo} width="40" height="40" alt="Logo"/>
      </Navbar.Brand>      
    </Navbar>  
)

export default TopNavbar