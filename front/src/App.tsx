import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/layout/Footer";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import TurnoPage from "./pages/TurnoPage";
import ProtectedRouter from "./components/ProtectedRouter";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Rutas públicas — cualquiera puede verlas */}
        <Route path="/" element={<HomePage />} />
        {/* El login ponemos en una página aparte para no ensuciar la landing */}
        <Route path="login" element={<LoginPage />} />

        {/** Protegemos las rutas que si o si tiene que tener el token */}
        <Route
          path="admin"
          element={
            //Protegemos la ruta del admin con el protector pero del admin.
            <AdminProtectedRoute>
              <AdminPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="turnos"
          element={
            <ProtectedRouter>
              <TurnoPage />
            </ProtectedRouter>
          }
        />

        {/* Ruta 404 — cualquier URL no definida cae acá */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
