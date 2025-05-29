import { Toaster } from "@/components/ui/sonner";
import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import {
  BookUser,
  Car,
  Home,
  Link,
  RouteIcon,
  TicketSlash,
  Users,
} from "lucide-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./auth-provider";
import { AppShellLayout } from "./common/layouts/app-shell-layout";
import { AuthLayout } from "./common/layouts/auth-layout";
import { dataProvider } from "./data-provider";
import { customTitleHandler } from "./lib/utils";
import { notificationProvider } from "./notification-provider";
import { Login } from "./pages/_auth.login";
import { Register } from "./pages/_auth.register";
import { AssignmentsPage } from "./pages/assignments";
import { AssignmentsEditPage } from "./pages/assignments.edit";
import { AssignmentsNewPage } from "./pages/assignments.new";
import { Dashboard } from "./pages/dashboard";
import { DriversPage } from "./pages/drivers";
import { DriversEditPage } from "./pages/drivers.edit";
import { DriversNewPage } from "./pages/drivers.new";
import { Invitations } from "./pages/invitations";
import { NotFound } from "./pages/not-found";
import { RoutesPage } from "./pages/routes";
import { RoutesEditPage } from "./pages/routes.edit";
import { RoutesNewPage } from "./pages/routes.new";
import { AdminsPage } from "./pages/admins";
import { VehiclesPage } from "./pages/vehicles";
import { VehiclesEditPage } from "./pages/vehicles.edit";
import { VehiclesNewPage } from "./pages/vehicles.new";

function App() {

  return (
    <BrowserRouter>
      <DevtoolsProvider>
        <Refine
          dataProvider={dataProvider(import.meta.env.VITE_API_ORIGIN)}
          routerProvider={routerBindings}
          authProvider={authProvider(import.meta.env.VITE_API_ORIGIN)}
          notificationProvider={notificationProvider}
          resources={[
            {
              name: "dashboard",
              list: "/",
              meta: {
                label: "Dashboard",
                icon: <Home />,
              },
            },
            {
              name: "admins",
              list: "/admins",
              meta: {
                parent: "dashboard",
                icon: <Users />,
              },
            },
            {
              name: "invitations",
              list: "/invitations",
              meta: {
                parent: "dashboard",
                icon: <TicketSlash />,
              },
            },
            {
              name: "drivers",
              list: "/drivers",
              create: "/drivers/new",
              edit: "/drivers/:id/edit",
              meta: {
                parent: "dashboard",
                icon: <BookUser />,
              },
            },
            {
              name: "vehicles",
              list: "/vehicles",
              create: "/vehicles/new",
              edit: "/vehicles/:id/edit",
              meta: {
                parent: "dashboard",
                icon: <Car />,
              },
            },
            {
              name: "assignments",
              list: "/assignments",
              create: "/assignments/new",
              edit: "/assignments/:id/edit",
              meta: {
                parent: "dashboard",
                icon: <Link />,
              },
            },
            {
              name: "routes",
              list: "/routes",
              create: "/routes/new",
              edit: "/routes/:id/edit",
              meta: {
                parent: "dashboard",
                icon: <RouteIcon />,
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            projectId: "6Pwv7v-89Qq3Q-KB404D",
            disableTelemetry: true,
          }}
        >
          <Routes>
            <Route
              element={
                <Authenticated
                  key="guard"
                  fallback={
                    <AuthLayout>
                      <Outlet />
                    </AuthLayout>
                  }
                >
                  <NavigateToResource resource="dashboard" />
                </Authenticated>
              }
            >
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route
              element={
                <Authenticated
                  key="main"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <AppShellLayout>
                    <Outlet />
                  </AppShellLayout>
                </Authenticated>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="admins">
                <Route index element={<AdminsPage />} />
              </Route>
              <Route path="invitations">
                <Route index element={<Invitations />} />
              </Route>
              <Route path="drivers">
                <Route index element={<DriversPage />} />
                <Route path="new" element={<DriversNewPage />} />
                <Route path=":curp/edit" element={<DriversEditPage />} />
              </Route>
              <Route path="vehicles">
                <Route index element={<VehiclesPage />} />
                <Route path="new" element={<VehiclesNewPage />} />
                <Route path=":id/edit" element={<VehiclesEditPage />} />
              </Route>
              <Route path="assignments">
                <Route index element={<AssignmentsPage />} />
                <Route path="new" element={<AssignmentsNewPage />} />
                <Route path=":vin/edit" element={<AssignmentsEditPage />} />
              </Route>
              <Route path="routes">
                <Route index element={<RoutesPage />} />
                <Route path="new" element={<RoutesNewPage />} />
                <Route path=":id/edit" element={<RoutesEditPage />} />
              </Route>
            </Route>
            <Route
              element={
                <Authenticated
                  key="error"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <AppShellLayout>
                    <Outlet />
                  </AppShellLayout>
                </Authenticated>
              }
            >
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <UnsavedChangesNotifier />
          <DocumentTitleHandler handler={customTitleHandler} />
          <Toaster />
        </Refine>
        <DevtoolsPanel />
      </DevtoolsProvider>
    </BrowserRouter>
  );
}

export default App;