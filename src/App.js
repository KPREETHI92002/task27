import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function App() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const handleAddUser = () => {
    axios.post(API_URL, formData)
      .then((response) => {
        setUsers([...users, response.data]);
        setShowModal(false);
        setFormData({ name: '', email: '' });
      })
      .catch((error) => {
        console.error('Error adding user: ', error);
      });
  };

  const handleEditUser = (id) => {
    axios.put(`${API_URL}/${id}`, formData)
      .then((response) => {
        const updatedUsers = users.map((user) =>
          user.id === id ? response.data : user
        );
        setUsers(updatedUsers);
        setShowModal(false);
        setFormData({ name: '', email: '' });
      })
      .catch((error) => {
        console.error('Error updating user: ', error);
      });
  };

  const handleDeleteUser = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error('Error deleting user: ', error);
      });
  };

  return (
    <div className="container mt-4">
      <h1>CRUD App with Axios</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add User
      </Button>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => {
                    setFormData({ name: user.name, email: user.email });
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {formData.id ? (
            <Button variant="primary" onClick={() => handleEditUser(formData.id)}>
              Save Changes
            </Button>
          ) : (
            <Button variant="primary" onClick={handleAddUser}>
              Add User
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;

