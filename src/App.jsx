import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginform from "./components/loginpagee";
import Layout    from "./components/layout";
import ProtectedRoute from "./ProtectedRoute";    
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Loginform />} />
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Layout />
  </ProtectedRoute>
} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;