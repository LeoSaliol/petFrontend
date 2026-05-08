import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loading } from "../components";
import { ProtectedLayout } from "./ProtectedLayout";
import App from "../App";

const Feed = lazy(() =>
  import("../pages/Feed").then((m) => ({ default: m.Feed })),
);
const Login = lazy(() =>
  import("../pages/Login").then((m) => ({ default: m.Login })),
);
const Profile = lazy(() =>
  import("../pages/Profile").then((m) => ({ default: m.Profile })),
);
const Register = lazy(() =>
  import("../pages/Register").then((m) => ({ default: m.default })),
);
const Pet = lazy(() =>
  import("../pages/Pet").then((m) => ({ default: m.default })),
);
const CreatePost = lazy(() =>
  import("../pages/CreatePost").then((m) => ({ default: m.CreatePost })),
);
const Notifications = lazy(() =>
  import("../pages/Notifications").then((m) => ({ default: m.Notifications })),
);
const ChatPage = lazy(() =>
  import("../pages/ChatPage").then((m) => ({ default: m.default })),
);

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Loading size="lg" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/"
          element={
            <App>
              <Feed />
            </App>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile/:id"
          element={
            <App>
              <Profile />
            </App>
          }
        />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route
            path="/create-post"
            element={
              <App>
                <CreatePost />
              </App>
            }
          />
          <Route
            path="/pets"
            element={
              <App>
                <Pet />
              </App>
            }
          />
          <Route
            path="/notifications"
            element={
              <App>
                <Notifications />
              </App>
            }
          />
          <Route
            path="/chats"
            element={
              <App>
                <ChatPage />
              </App>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
