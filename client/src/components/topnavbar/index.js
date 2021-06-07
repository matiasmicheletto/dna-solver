import React from 'react';
import { Navbar } from 'react-bootstrap';
import logo from '../../img/logo_uns.png';
import classes from './styles.module.css';

const TopNavbar = () => (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Navbar.Brand>
        <img className={classes.Logo} src={logo} alt="Logo"/>
      </Navbar.Brand>      
    </Navbar>  
)

export default TopNavbar