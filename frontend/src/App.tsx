import './App.css';
import KanbanBoard from './KanbanBoard';

function App() {

  const columns = [
    {
      id: 1,
      title: 'ToDo',
      tasks: [
        { id: 1, title: 'Task 1', description: 'Description 1' },
        { id: 2, title: 'Task 2', description: 'Description 2' },
      ],
    },
    {
      id: 2,
      title: 'In Progress',
      tasks: [
        { id: 3, title: 'Task 3', description: 'Description 3' },
        { id: 4, title: 'Task 4', description: 'Description 4' },
      ],
    },
    // Add more columns as needed
  ];
  return (
    <div className="App">
      <KanbanBoard/>
    </div>
  );
}

export default App;
