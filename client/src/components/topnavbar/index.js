import React, { useContext, useState } from 'react';
import { Navbar, Nav, Spinner } from 'react-bootstrap';
import { LoadingContext } from '../../context/LoadingContext';
import logo from '../../img/logo_uns.png';
import { FaGithub, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';
import InfoModal from '../modals/info';
import classes from './styles.module.css';

const TopNavbar = () => {

  const { loading } = useContext(LoadingContext);
  const [info, showInfo] = useState(false);

  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Navbar.Brand>
        <img className={classes.Logo} src={logo} alt="Logo"/>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />   
      <Navbar.Collapse>
        <Nav>
          <Nav.Link title="Source code" href="https://github.com/matiasmicheletto/sganode" target="_blank" rel="noopener noreferrer">
            <FaGithub size={25} />
          </Nav.Link>
          <Nav.Link title="About">
            <FaInfoCircle size={25} onClick={()=>showInfo(true)}/>
          </Nav.Link>
          <Nav.Link title="Help">
            <FaQuestionCircle size={25} />
          </Nav.Link>
        </Nav>
        <Nav className={["justify-content-end", classes.SpinnerContainer]}>
          <Nav.Link>
            {loading && <Spinner animation="border" variant="light"/>}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <InfoModal show={info} onHide={()=>showInfo(false)}/>
    </Navbar>  
  );
};

export default TopNavbar;