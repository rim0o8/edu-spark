import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

type Task = {
    id: string;
    content: string;
};

type Column = {
    id: string;
    title: string;
    tasks: Task[];
};

const initialColumns: Column[] = [
    {
        id: 'column-1',
        title: 'To do',
        tasks: [
            { id: 'task-1', content: 'Task 1' },
            { id: 'task-2', content: 'Task 2' },
        ],
    },
    {
        id: 'column-2',
        title: 'In progress',
        tasks: [
            { id: 'task-3', content: 'Task 3' },
        ],
    },
    {
        id: 'column-3',
        title: 'Done',
        tasks: [],
    },
];

const KanbanBoard: React.FC = () => {
    const [columns, setColumns] = useState(initialColumns);
    const [newTaskContent, setNewTaskContent] = useState('');

    const handleTaskMove = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
        let taskToMove: Task | null = null;

        // First find the task in the source column and remove it
        const newColumns = columns.map(column => {
            if (column.id === sourceColumnId) {
                const newTasks = column.tasks.filter(task => {
                    if (task.id === taskId) {
                        taskToMove = task;
                        return false;
                    } else {
                        return true;
                    }
                });

                return { ...column, tasks: newTasks };
            } else {
                return column;
            }
        });

        // Then add the task to the target column
        if (taskToMove) {
            const targetColumnIndex = newColumns.findIndex(column => column.id === targetColumnId);
            if (targetColumnIndex !== -1) {
                newColumns[targetColumnIndex] = {
                    ...newColumns[targetColumnIndex],
                    tasks: [...newColumns[targetColumnIndex].tasks, taskToMove],
                };
            }
        }

        setColumns(newColumns);
    };

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
    };

    return (
        <div className="App">
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
            <form onSubmit={handleNewTaskSubmit}>
                <input type="text" value={newTaskContent} onChange={handleNewTaskInputChange} placeholder="Enter a new task" />
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default KanbanBoard;
