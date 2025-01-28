import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  CardActions,
  Typography,
  Alert,
  Grid,
  CircularProgress,
} from '@mui/material';
import Loader from './Components/Loader';
import SearchComponent from './Components/SearchComponent';
import { styled } from '@mui/system';

const StyledDialog = styled(Dialog)({
  '.MuiDialog-paper': {
    backgroundColor: '#f0f4fa',
    borderRadius: '20px',
    padding: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
});

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', email: '', street: '', city: '', zipcode: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  const apiEndpoint = 'https://jsonplaceholder.typicode.com/users';

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiEndpoint, {
        params: { _page: page, _limit: 50 },
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    setSelectedUser(user);
    setFormData(
      user
        ? {
            name: user.name,
            username: user.username,
            email: user.email,
            street: user.address.street,
            city: user.address.city,
            zipcode: user.address.zipcode,
          }
        : { name: '', username: '', email: '', street: '', city: '', zipcode: '' }
    );
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (selectedUser) {
        // Simulate API update call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setUsers((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id
              ? { ...user, ...formData, address: { street: formData.street, city: formData.city, zipcode: formData.zipcode } }
              : user
          )
        );
        setNotification({ 
          message: 'User updated successfully! ✏️', 
          severity: 'info', 
          color: 'success'
        });
      } else {
        const newUser = {
          ...formData,
          id: Date.now(),
          address: { street: formData.street, city: formData.city, zipcode: formData.zipcode },
        };
        setUsers((prev) => [...prev, newUser]);
        setNotification({ 
          message: 'User added successfully! 🎉', 
          severity: 'success', 
          color: 'success' 
        });
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save user. Please try again.');
      setNotification({ 
        message: 'An error occurred while saving the user! ⚠️', 
        severity: 'error',
        color: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${apiEndpoint}/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setNotification({
        message: 'User deleted successfully! 🗑️',
        severity: 'success',
        color: 'warning' 
      });
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      setNotification({
        message: 'An error occurred while deleting the user! ⚠️',
        severity: 'error',
        color: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>User Management Dashboard</h1>
      
      {/* Notification Alert */}
      {notification && (
        <Alert 
          severity={notification.severity} 
          style={{ marginBottom: '20px', borderRadius: '10px' }}
        >
          {notification.message}
        </Alert>
      )}

      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} disabled={loading} style={{borderRadius: '10px'}}>
          Add User
        </Button>
      </div>

      <Grid container spacing={3} onScroll={handleScroll} style={{ maxHeight: '80vh', overflowY: 'auto'}}>
        {filteredUsers.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                {user.name}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '10px' }}>
                <strong>Username:</strong> {user.username}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '10px' }}>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '10px' }}>
                <strong>Street:</strong> {user.address?.street}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '10px' }}>
                <strong>City:</strong> {user.address?.city}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '10px' }}>
                <strong>Zipcode:</strong> {user.address?.zipcode}
              </Typography>
              <CardActions>
                <Button color="primary" onClick={() => handleOpenDialog(user)} style={{ marginRight: '10px' }} disabled={loading}>
                  Edit
                </Button>
                <Button color="secondary" onClick={() => handleDelete(user.id)} disabled={loading}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading && <Loader />}

      <StyledDialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle style={{ backgroundColor: '#3f51b5', color: '#fff', textAlign: 'center', borderRadius: '17px' }}>
          {selectedUser ? 'Edit User' : 'Add User'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Username"
            name="username"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Street"
            name="street"
            fullWidth
            value={formData.street}
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="City"
            name="city"
            fullWidth
            value={formData.city}
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Zipcode"
            name="zipcode"
            fullWidth
            value={formData.zipcode}
            onChange={handleInputChange}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: '#3f51b5', color: '#fff', borderRadius: '10px' }} disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </StyledDialog>
    </div>
  );
};

export default App;
