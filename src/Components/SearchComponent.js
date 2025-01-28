import React from 'react';
import { TextField } from '@mui/material';

const SearchComponent = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField
      label="Search by Name"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ marginBottom: '20px' }}
    />
  );
};

export default SearchComponent;
