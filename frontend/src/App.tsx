import React, { useState, ChangeEvent, FormEvent } from 'react';
import './App.css';
import KanbanBoard from './KanbanBoard';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShouldRedirect(true);
  };

  if (shouldRedirect) {
    return <KanbanBoard />;
  }

  return (
    <div className="App">
      <h1 className='gradient'>Project Kanban Board builder</h1>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          marginTop: '20px',
        }}
      >
        <TextField
          variant="outlined"
          value={inputValue}
          onChange={handleChange}
          label="Enter your project summary"
          fullWidth
          sx={{
            backgroundColor: '#fff',
          }}
        />
        <Button variant="contained" type="submit" color="primary">
          Build Kanban Board
        </Button>
      </Box>
    </div>
  );
}

export default App;
