import React, { useState, ChangeEvent, FormEvent } from 'react';
import './App.css';
import QuestionPage from './QuestionPage';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';



function App() {
    const [inputValue, setInputValue] = useState('');
    const [redirectPage, setRedirectPage] = useState('');
    const [questions, setQuestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

      try {
        setIsLoading(true);
        const formdata = new FormData()
        formdata.append('purpose', inputValue)
        const response = await fetch(
            'http://localhost:8080/api/make_questions', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ purpose: inputValue }),
            }
        );
        const data = await response.json();
        setQuestions(data);
        setRedirectPage('questions');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

  if (isLoading) {
    return (
      <div className="Loading">
        <h2 className='gradient'>Prepare questions</h2>
        <CircularProgress />
      </div>
    )
  }
    if (redirectPage === 'questions') {
      return <QuestionPage questions={questions} purpose={inputValue} />
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
