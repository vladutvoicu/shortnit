import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Main } from "./pages/Main/Main";
import { Redirect } from "./pages/Redirect/Redirect";
import { PasswordReset } from "./pages/PasswordReset/PasswordReset";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main blankPath={true} />} />
        <Route path="/:urlId" element={<Redirect />} />
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
          path="/app/password/reset"
          element={<Main sideBarContentType="reset" />}
        />
        <Route path="/app/password/reset/:urlId" element={<PasswordReset />} />
        <Route
          path="/app/about"
          element={<Main sideBarContentType="about" />}
        />
        <Route path="/app/urls" element={<Main sideBarContentType="urls" />} />
        <Route
          path="/app/account"
          element={<Main sideBarContentType="account" />}
        />
        <Route
          path="/app/urls/edit/:alias"
          element={<Main sideBarContentType="edit" />}
        />
        <Route
          path="/app/urls/stats/:alias"
          element={<Main sideBarContentType="stats" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
