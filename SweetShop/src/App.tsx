// App.tsx
import { BrowserRouter as Router} from "react-router-dom";
import {Routes} from "react-router";
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
