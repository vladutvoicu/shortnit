import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Main } from "./pages/Main/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main blankPath={true} />} />
        <Route path="/app" element={<Main />} />
        <Route
          path="/app/register"
          element={<Main sideBarContentType="register" />}
        />
        <Route
          path="/app/login"
          element={<Main sideBarContentType="login" />}
        />
        <Route
          path="/app/about"
          element={<Main sideBarContentType="about" />}
        />
        <Route path="/app/urls" element={<Main sideBarContentType="urls" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
