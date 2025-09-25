// App.tsx
import { BrowserRouter as Router, Routes } from "react-router-dom";
import authRoutes from "./routes/authRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {authRoutes}

      </Routes>
    </Router>
  );
}

export default App;
