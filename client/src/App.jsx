import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./utils/PrivateRoute";
import Home from "./pages/home/Home";
import JoinRoom from "./components/JoinRoom";
import NotFoundPage from "./pages/NotFound";
import UserSearch from "./components/UserSearch";
import FriendRequests from "./components/FriendRequests";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
          <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <PrivateRoute>
          <FriendRequests />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/join"
        element={
          <PrivateRoute>
            <JoinRoom />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <UserSearch />
          </PrivateRoute>
        }
      />

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
