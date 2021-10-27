import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Button,
} from "react-bootstrap";
import IResult from "../typings/result";

function Search() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [result, setResult] = useState<IResult[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<IResult | null>(null);

  const handleClose = () => setShow(false);
  const handleShow = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    fetchSongById(e.currentTarget.id);
    setShow(true);
  };

  const fetchSongById = async (id: string) => {
    try {
      let response = await fetch(
        "https://striveschool-api.herokuapp.com/api/deezer/track/" + id
      );
      if (response.ok) {
        let result = await response.json();
        console.log(result);
        setSelectedSong(result);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSong = async () => {
    try {
      let response = await fetch(
        "https://striveschool-api.herokuapp.com/api/deezer/search?q=" +
          searchQuery
      );
      if (response.ok) {
        let result = await response.json();
        console.log(result.data);
        setResult(result.data);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    searchQuery.length > 3 && fetchSong();
  }, [searchQuery]);

  return (
    <>
      <Container>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Search</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>
        {result.length !== 0 && (
          <Row>
            {result.map((r) => (
              <Col>
                <Card
                  id={`${r?.id}`}
                  style={{ width: "18rem", color: "black" }}
                  onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
                    handleShow(e)
                  }
                >
                  <Card.Body>
                    <Card.Title>{r.title}</Card.Title>
                    <Card.Text>{(r.duration, r.rank)}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedSong !== null && selectedSong.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSong !== null && selectedSong.album.title}
            <hr />
            <p> {selectedSong !== null && selectedSong.duration}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleClose}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default Search;
