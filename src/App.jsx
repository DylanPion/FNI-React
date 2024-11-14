import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Root from "./components/Root";
import Layout from "./components/Layout";
import AssociationPage from "./pages/AssociationPage";
import TresoryPage from "./pages/TresoryPage";
import AccountingPage from "./pages/AccountingPage";
import SecureRoot from "./components/SecureRoot";
import CompanySheetPage from "./pages/CompanySheetPage";
import CompanySheetDetaillPage from "./pages/CompanySheetDetaillPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <SecureRoot>
              <Root />
            </SecureRoot>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SecureRoot>
              <Layout />
            </SecureRoot>
          }
        >
          <Route path="association" element={<AssociationPage />} />
          <Route path="association/:id" element={<CompanySheetPage />} />
          <Route
            path="association/:id/companysheet/:companySheetId"
            element={<CompanySheetDetaillPage />}
          />
          <Route path="tresory" element={<TresoryPage />} />
          <Route path="accounting" element={<AccountingPage />} />
        </Route>
        <Route
          path="*"
          element={
            <SecureRoot>
              <Layout />
            </SecureRoot>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
