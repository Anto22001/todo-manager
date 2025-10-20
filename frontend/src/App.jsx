import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Todo, Todos } from "./pages";
import { MainLayout, ProtectedRoutes} from "./utils";
import './styles/App.css';

function App() {
  const { isLogged } = useSelector((state) => state.auth);

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={isLogged ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/todos" element={<Todos />} />
        </Route>
        <Route path="/todo/:id" element={<Todo />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;