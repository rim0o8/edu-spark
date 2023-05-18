import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

type Task = {
    id: string;
    content: string;
};

type Column = {
    id: string;
    title: string;
    tasks: Task[];
};

interface Props {
    initialTasks: string[];
}

const KanbanBoard: React.FC<Props> = ({ initialTasks }) => {
    const initialColumns: Column[] = [
        {
            id: 'column-1',
            title: 'To do',
            tasks: initialTasks.map((task: string, index: number) => ({
                id: `task-${index}`,
                content: task,
            })),
        },
        {
            id: 'column-2',
            title: 'In progress',
            tasks: [],
        },
        {
            id: 'column-3',
            title: 'Done',
            tasks: [],
        },
    ];
    const [columns, setColumns] = useState(initialColumns);
    const [newTaskContent, setNewTaskContent] = useState('');

    const handleTaskCreate = (columnId: string, taskContent: string) => {
        const newTask: Task = { id: 'task-' + Date.now(), content: taskContent };

        const newColumns = columns.map(column => {
            if (column.id === columnId) {
                return { ...column, tasks: [...column.tasks, newTask] };
            } else {
                return column;
            }
        });

        setColumns(newColumns);
    };

    const handleNewTaskInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTaskContent(event.target.value);
    };

    const handleNewTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (newTaskContent.trim() !== '') {
            handleTaskCreate('column-1', newTaskContent);
        }
        setNewTaskContent('');
    };

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const startColumn = columns.find(col => col.id === source.droppableId);
        const endColumn = columns.find(col => col.id === destination.droppableId);

        if (startColumn && endColumn) {
            if (startColumn === endColumn) {
                const newTaskList = Array.from(startColumn.tasks);
                const [removed] = newTaskList.splice(source.index, 1);
                newTaskList.splice(destination.index, 0, removed);

                const newColumns = columns.map(col => {
                    if (col.id === startColumn.id) {
                        return { ...col, tasks: newTaskList };
                    }
                    return col;
                });

                setColumns(newColumns);
            } else {
                const startTasks = Array.from(startColumn.tasks);
                const [removed] = startTasks.splice(source.index, 1);
                const endTasks = Array.from(endColumn.tasks);
                endTasks.splice(destination.index, 0, removed);

                const newColumns = columns.map(col => {
                    if (col.id === startColumn.id) {
                        return { ...col, tasks: startTasks };
                    } else if (col.id === endColumn.id) {
                        return { ...col, tasks: endTasks };
                    } else {
                        return col;
                    }
                });

                setColumns(newColumns);
            }
        }
    };



    return (
        <div className="container">
            <h2 className='gradient'>Kanban Board</h2>
            <Box
                component="form"
                onSubmit={handleNewTaskSubmit}
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
                    value={newTaskContent}
                    onChange={handleNewTaskInputChange}
                    label="Enter a new task"
                    fullWidth
                    sx={{
                        backgroundColor: '#fff',
                    }}
                />
                <Button variant="contained" type="submit" color="primary">
                    Add Task
                </Button>
            </Box>
            <div className='Kanban'>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {columns.map((column, columnIndex) => (
                        <Droppable droppableId={column.id} key={column.id}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                                    <h2 className="gradient">{column.title}</h2>
                                    {column.tasks.map((task, taskIndex) => (
                                        <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="task"
                                                >
                                                    {task.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </div>
        </div>
    );
};

export default KanbanBoard;
