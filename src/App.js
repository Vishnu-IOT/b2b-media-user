import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./utils/ScrollToTop";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import Home from "./pages/Home";
import BusinessProfilePage from "./pages/BusinessProfilePage";
import StoriesPage from "./pages/StoriesPage";
import StrategiesPage from "./pages/StrategiesPage";
import AchievementsPage from "./pages/AchievementsPage";
import ProductsPage from "./pages/ProductsPage";
import EnquiriesPage from "./pages/EnquiriesPage";
import VideosPage from "./pages/VideosPage";
import CommunityPage from "./pages/CommunityPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import ResourcesPage from "./pages/ResourcesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage, { VerifyEmailPage } from "./pages/RegisterPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import SearchPage from "./pages/SearchPage";
import BusinessesPage from "./pages/BusinessesPage";
import AccountPage from "./pages/AccountPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/search" element={<SearchPage />} />
            <Route path="/businesses" element={<BusinessesPage />} />
            <Route
              path="/businesses/:idOrSlug"
              element={<BusinessProfilePage />}
            />

            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/stories/:id" element={<StoriesPage />} />

            <Route path="/strategies" element={<StrategiesPage />} />
            <Route path="/strategies/:id" element={<StrategiesPage />} />

            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/achievements/:id" element={<AchievementsPage />} />

            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductsPage />} />

            <Route path="/enquiries" element={<EnquiriesPage />} />
            <Route path="/enquiries/:id" element={<EnquiriesPage />} />

            <Route path="/videos" element={<VideosPage />} />
            <Route path="/videos/:id" element={<VideosPage />} />

            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:id" element={<QuestionDetailPage />} />

            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:idOrSlug" element={<ResourcesPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            <Route path="/newsletter/unsubscribe" element={<UnsubscribePage />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
