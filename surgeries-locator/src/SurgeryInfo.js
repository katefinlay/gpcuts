import React from 'react';
import { InfoWindow } from "@react-google-maps/api";
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { Card, Col, Row, Button } from 'react-bootstrap';
import './SurgeryInfo.css';
import Chart from './Chart.js';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserMd } from '@fortawesome/free-solid-svg-icons';

const SurgeryInfo = ({ selected, setSelected }) => {

  const gpHeadcountOrdered = Object.keys(selected.properties.total_gp_fte).map(e => parseInt(e)).sort();
  const gpHeadcount2013 = selected.properties.total_gp_fte[`${gpHeadcountOrdered[0]}`];
  const gpHeadcount2022 = selected.properties.total_gp_fte[`${gpHeadcountOrdered[gpHeadcountOrdered.length - 1]}`];

  // const patientsOrdered = Object.keys(selected.properties.total_patients).map(e => parseInt(e)).sort();
  // const patients2013 = selected.properties.total_patients[`${patientsOrdered[0]}`];
  // const patients2022 = selected.properties.total_patients[`${patientsOrdered[patientsOrdered.length - 1]}`];
  // const patientsPerGp2013 = Math.round(patients2013 / gpHeadcount2013);
  // const patientsPerGp2022 = Math.round(patients2022 / gpHeadcount2022);

  const mpPartyColor = {
    'Conservative': '#0087DC',
    'Labour': '#E4003B',
    'Liberal Democrats': '#FAA61A',
  };

  const PatientsPerGp = ({ patientsPerGp, year }) => (
    <span style={{ display: 'flex', alignItems: 'center', margin: '1rem' }}>
      <div style={{ marginRight: '0.25rem' }}>
        <FontAwesomeIcon icon={faUsers} style={{ fontSize: '1.25rem' }} />
        <p style={{ fontSize: '0.6rem', margin: 0, letterSpacing: '2px' }}>{year}</p>
      </div>
      <h4>
        <span style={{ marginLeft: '0.25rem', marginRight: '0.25rem' }}>{patientsPerGp}</span> </h4>
      per doctor
    </span>
  );

  return (
    <InfoWindow
      position={{
        lat: selected.geometry.coordinates[1],
        lng: selected.geometry.coordinates[0],
      }}
      onCloseClick={() => {
        setSelected(null);
      }}
    >
      <div className="container">
        <h2 className="text-center font-heading" style={{ margin: '1rem' }} >{selected.properties.name}</h2>
        <Row className="justify-content-center">
          <Col md={6} className="mb-3 mb-md-0">
            <Card border="primary" className="rounded-3 shadow">
              <Card.Header className="bg-primary text-white font-subheading">
                Total GP Headcount Comparison
              </Card.Header>
              <Card.Body className="text-center">
                <h3><span><FontAwesomeIcon icon={faUserMd} style={{ fontSize: '1.5rem', marginRight: '1rem' }} />{Math.round(gpHeadcount2013)} in 2013</span></h3>
                <h3><span><FontAwesomeIcon icon={faUserMd} style={{ fontSize: '1.5rem', marginRight: '1rem' }} />{Math.round(gpHeadcount2022)} in 2022</span></h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card border="primary" className="rounded-3 shadow">
              <Card.Header className="bg-primary text-white font-subheading">
                Constituency and MP
              </Card.Header>
              <Card.Body >
              <h6>Constituency: {selected.properties.constituency_code}</h6>
              <h6>MP: {selected.properties.MP}</h6>
              <h6 style={{ color: mpPartyColor[selected.properties.Party] }}>
                Party: {selected.properties.Party}
              </h6>
              </Card.Body>
            </Card>
          </Col>
          {/* <Col md={6}>
            <Card border="primary" className="rounded-3 shadow">
              <Card.Header className="bg-primary text-white font-subheading">
                Patients per GP Comparison
              </Card.Header>
              <Card.Body className="text-center">
                <PatientsPerGp patientsPerGp={patientsPerGp2013} year={2013} />
                <PatientsPerGp patientsPerGp={patientsPerGp2022} year={2022} />
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
        <div className="my-4">
          <Card border="secondary" className="rounded-3 shadow">
            <Card.Header className="bg-secondary text-white font-subheading">
              Patients per GP
            </Card.Header>
            <Card.Body>
              <Chart total_patients={selected.properties.total_patients} total_gp_fte={selected.properties.total_gp_fte} />
            </Card.Body>
          </Card>
        </div>
        {/* <div className="my-4">
          <Card border="secondary" className="rounded-3 shadow">
            <Card.Header className="bg-secondary text-white font-subheading">
              Constituency and MP
            </Card.Header>
            <Card.Body>
              <p>Constituency: {selected.properties.constituency_code}</p>
              <p>MP: {selected.properties.mp}</p>
              <p style={{ color: mpPartyColor[selected.properties.Party] }}>
                Party: {selected.properties.Party}
              </p>
            </Card.Body>
          </Card>
        </div> */}
        <div className="mb-4 text-center">
          <p className="mb-2 font-subheading">Share this information:</p>
          <div className="d-flex justify-content-center">
            <Button
              href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              style={{ marginRight: '1rem' }}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
              className="me-3 rounded-circle"
            >
              <FaFacebook />
            </Button>
            <Button
              href={`https://twitter.com/share?url=${encodeURIComponent(
                window.location.href
              )}`}
              style={{ marginLeft: '1rem' }}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
              className="me-3 rounded-circle"
            >
              <FaTwitter />
            </Button>
          </div>
        </div>
      </div>
    </InfoWindow >
  );
};

export default SurgeryInfo;