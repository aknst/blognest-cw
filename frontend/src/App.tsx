import { Suspense, useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { client } from "./client";
import BlankLayout from "./components/layouts/BlankLayout";
import { FullPageLoader } from "./pages/misc/FullLoaderPage";
import { NotFoundPage } from "./pages/misc/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";
import SidebarLayout from "./components/layouts/SidebarLayout";
import PrivateRoute from "./components/routes/private-route";
import { useAuthStore } from "./states/auth-state";
import { RegisterPage } from "./pages/RegisterPage";
import BlogPage from "./pages/BlogPage";
import BlogPostFormPage from "./pages/BlogPostFormPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostsPage from "./pages/PostsPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import BlogsPage from "./pages/BlogsPage";

client.setConfig({
  baseURL: import.meta.env.VITE_API_URL,
  throwOnError: true,
});

client.instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  const refreshUserDetails = useAuthStore((state) => state.refreshUserDetails);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshUserDetails();
    }, 1 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshUserDetails]);

  return (
    <Suspense fallback={<FullPageLoader />}>
      <BrowserRouter>
        <Routes>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<PostsPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/create" element={<BlogPostFormPage />} />
              <Route path="/posts/:id/edit" element={<BlogPostFormPage />} />
              <Route path="/settings" element={<ProfileSettingsPage />} />
            </Route>

            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog" element={<Outlet />}>
              <Route element={<PrivateRoute />}>
                <Route index element={<BlogPage owner={true} />} />
              </Route>
              <Route path=":id" element={<BlogPage owner={false} />} />
            </Route>
          </Route>

          <Route element={<BlankLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
