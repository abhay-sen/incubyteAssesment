import { Route } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
const authRoutes = (
    <Route path="/register" element={<RegisterPage/>}/>
    
);
export default authRoutes;