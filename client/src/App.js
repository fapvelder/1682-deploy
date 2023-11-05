import "./App.css";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { routes } from "./routes/AllRoutes";
import Navigation from "./component/Navigation";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import Footer from "./component/Footer";
import ChatGPT from "./component/ChatGPT";

function App() {
  const allRoutes = useRoutes(routes);
  const userTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState("");
  useEffect(() => {
    setTheme(userTheme);
  }, [userTheme]);

  return (
    <div className={`App ${theme}`}>
      <Navigation />
      {/* <ChatGPT /> */}
      <ToastContainer position="bottom-center" limit={5} />
      {allRoutes}
      <Footer />
    </div>
  );
}

export default App;
