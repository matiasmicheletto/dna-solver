import React, { useContext } from 'react';
import { Navbar, Nav, Spinner } from 'react-bootstrap';
import logo from '../../img/logo_uns.png';
import classes from './styles.module.css';
import { LoadingContext } from '../../context/LoadingContext';

const TopNavbar = () => {

  const { loading } = useContext(LoadingContext);

  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Navbar.Brand>
        <img className={classes.Logo} src={logo} alt="Logo"/>
      </Navbar.Brand>   
      <Navbar.Collapse className="justify-content-end px-4">
        <Nav>
          {loading && <Spinner animation="border" variant="light"/>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>  
  );
}

export default TopNavbar