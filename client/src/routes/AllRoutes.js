import UserRoute from "../component/ProtectedRoute/UserRoute";
import AdminDashboard from "../pages/AdminPages/AdminDashboard";
import Chat from "../pages/AuthPages/ChatPage/Chat";
import CheckoutPage from "../pages/AuthPages/CheckoutPage";
import EditPage from "../pages/AuthPages/EditPage";
import Homepage from "../pages/AuthPages/Homepage/Homepage";
import InventoryPage from "../pages/AuthPages/InventoryPage";
import ListingsPage from "../pages/AuthPages/ListingPage";
import NotificationsPage from "../pages/AuthPages/NotificationsPage";
import OrderDetailsPage from "../pages/AuthPages/OrderDetailsPage";
import ProductDetails from "../pages/AuthPages/ProductDetailsPage";
import Profile from "../pages/AuthPages/ProfilePage";
import Listings from "../pages/AuthPages/ProfilePage/ProfileChildren/Listings";
import PurchasePage from "../pages/AuthPages/PurchasePage";
import SearchPage from "../pages/AuthPages/SearchPage";
import SellItem from "../pages/AuthPages/SellItemPage";
import GameItems from "../pages/AuthPages/SellItemPage/GameItems";
import ListingItem from "../pages/AuthPages/SellItemPage/ListingItems";
import Setting from "../pages/AuthPages/SettingPage";
import TradeItemsPage from "../pages/AuthPages/TradePage";
import Wallet from "../pages/AuthPages/WalletPage";
import ForgotPassword from "../pages/NotAuthPages/ForgotPasswordPage/ForgotPassword";
import ResetPassword from "../pages/NotAuthPages/ForgotPasswordPage/ResetPassword";
import Login from "../pages/NotAuthPages/LoginPage/Login";
import NotFoundPage from "../pages/NotAuthPages/NotFoundPage";
import Register from "../pages/NotAuthPages/RegisterPage/Register";

export const routes = [
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/chat",
    element: (
      <UserRoute>
        <Chat />
      </UserRoute>
    ),
  },
  {
    path: "/chat/:slug",
    element: (
      <UserRoute>
        <Chat />
      </UserRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile/:slug",
    element: <Profile />,
  },
  {
    path: "/settings",
    element: (
      <UserRoute>
        <Setting />
      </UserRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <UserRoute>
        <AdminDashboard />
      </UserRoute>
    ),
  },
  {
    path: "/item",
    children: [
      {
        path: ":productID",
        element: <ProductDetails />,
      },
    ],
  },
  {
    path: "/edit",
    children: [
      {
        path: ":productID",
        element: (
          <UserRoute>
            <EditPage />
          </UserRoute>
        ),
      },
    ],
  },
  {
    path: "/sell-item",
    children: [
      {
        path: "",
        element: (
          <UserRoute>
            <SellItem />
          </UserRoute>
        ),
      },

      {
        path: ":category",
        children: [
          {
            path: ":subcategory",
            children: [
              {
                path: ":gametitle",
                element: <GameItems />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/listing",
    element: (
      <UserRoute>
        <ListingItem />
      </UserRoute>
    ),
  },
  {
    path: "/wallet",
    element: (
      <UserRoute>
        <Wallet />
      </UserRoute>
    ),
  },
  {
    path: "/inventory",
    element: (
      <UserRoute>
        <InventoryPage />
      </UserRoute>
    ),
  },
  {
    path: "/checkout/:id",
    element: (
      <UserRoute>
        <CheckoutPage />
      </UserRoute>
    ),
  },
  {
    path: "/purchases/",
    element: (
      <UserRoute>
        <PurchasePage />
      </UserRoute>
    ),
  },
  {
    path: "/listings/",
    element: (
      <UserRoute>
        <ListingsPage />
      </UserRoute>
    ),
  },
  {
    path: "/order-details/:id",
    element: (
      <UserRoute>
        <OrderDetailsPage />
      </UserRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <UserRoute>
        <NotificationsPage />
      </UserRoute>
    ),
  },
  {
    path: "/search/:keyword",
    element: <SearchPage />,
  },
  {
    path: "/trade-items",
    element: (
      <UserRoute>
        <TradeItemsPage />
      </UserRoute>
    ),
  },
];
