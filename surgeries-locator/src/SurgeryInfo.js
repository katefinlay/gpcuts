import React from 'react';
import { InfoWindow } from "@react-google-maps/api";
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { Card, Col, Row, Button } from 'react-bootstrap';
import './SurgeryInfo.css';

const SurgeryInfo = ({ selected, setSelected }) => {
  const gpHeadcount2013 = selected.properties.total_gp_fte_2013;
  const gpHeadcount2022 = selected.properties.total_gp_fte_2022;
  const patients2013 = selected.properties.total_patients_2013;
  const patients2022 = selected.properties.total_patients_2022;

  const patientsPerGp2013 = Math.round(patients2013 / gpHeadcount2013);
  const patientsPerGp2022 = Math.round(patients2022 / gpHeadcount2022);

  const mpPartyColor = {
    'Conservative': '#0087DC',
    'Labour': '#E4003B',
    'Liberal Democrats': '#FAA61A',
  };

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
        <h2 className="text-center font-heading">{selected.properties.name}</h2>
        <Row className="justify-content-center">
          <Col md={6} className="mb-3 mb-md-0">
            <Card border="primary" className="rounded-3 shadow">
              <Card.Header className="bg-primary text-white font-subheading">
                Total GP Headcount Comparison
              </Card.Header>
              <Card.Body className="text-center">
                <h3>{gpHeadcount2013} in 2013</h3>
                <h3>{gpHeadcount2022} in 2022</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card border="primary" className="rounded-3 shadow">
              <Card.Header className="bg-primary text-white font-subheading">
                Patients per GP Comparison
              </Card.Header>
              <Card.Body className="text-center">
                <h3>{patientsPerGp2013} in 2013</h3>
                <h3>{patientsPerGp2022} in 2022</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="my-4">
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
        </div>
        <div className="mb-4 text-center">
          <p className="mb-2 font-subheading">Share this information:</p>
          <div className="d-flex justify-content-center">
            <Button
              href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
              className="me-3 rounded-circle bg-light"
                        >
                            <FaFacebook />
                        </Button>
                        <Button
                            href={`https://twitter.com/share?url=${encodeURIComponent(
                                window.location.href
                            )}`}
                            variant="primary"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="me-3 rounded-circle bg-light"
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