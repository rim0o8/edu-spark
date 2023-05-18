import React, { useState, ChangeEvent, FormEvent } from 'react';
import './App.css';
import KanbanBoard from './KanbanBoard';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
    questions: string[];
    purpose: string;
}

const QuestionPage: React.FC<Props> = ({ questions, purpose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [answers, setAnswers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tasks, setTasks] = useState<string[]>([]);
    const [redirectPage, setRedirectPage] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleQuestionSubmit = async (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault();

        setCurrentIndex((prevIndex) => prevIndex + 1);
        setAnswers((prevAnswers) => [...prevAnswers, inputValue]);
        setInputValue('');

        if (currentIndex + 1 === questions.length) {
            try {
                setIsLoading(true);
                const response = await fetch(
                    'http://localhost:8080/api/build_todo', {
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ purpose: purpose, questions: questions, answers: answers}),
                    }
                );
                const data = await response.json();
                setTasks(data);
                setRedirectPage(true);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (redirectPage) {
        return <KanbanBoard initialTasks={ tasks } />
    }

    if (isLoading) {
        return (
            <div className="Loading">
                <h2 className='gradient'>Building</h2>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className='container'>
            <h2 className='gradient'>{ questions[currentIndex] }</h2>
            <Box
                component="form"
                onSubmit={handleQuestionSubmit}
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
                    Next
                </Button>
            </Box>
        </div>
    );
};

export default QuestionPage;
