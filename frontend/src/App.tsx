import { Routes, Route, Navigate } from 'react-router-dom';
import { CreateTaskPage, EditTaskPage, TaskListPage } from './pages';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<TaskListPage />} />
      <Route path="/create" element={<CreateTaskPage />} />
      <Route path="/edit/:id" element={<EditTaskPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
