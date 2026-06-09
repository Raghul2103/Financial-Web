import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

// layouts
import AuthLayout from "./component/layout/AuthLayout";
import AdminLayout from "./component/layout/AdminLayout";

// pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Error from "./pages/Error";
import Income from "./pages/Income/Income";
import Account from "./pages/Income/Account";
import Transfer from "./pages/Income/Transfer";
import ExpensePage from "./pages/Expense/ExpensePage";

const router = createBrowserRouter([
    {
    path: "/", // ✅ handle root
    element: <Navigate to="/login" />,
  },
  
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
    path: "income",
    element: <Income />,
  },
  {
    path:"account",
    element:<Account/>

  },
   {
    path:"transfer",
    element:<Transfer/>

  },
  {
path: "expense",
element: <ExpensePage />,
  },
    ],
  },
    {
    path: "*",
    element: <Error />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;