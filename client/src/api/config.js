let URL = "";
if (window.location.href.startsWith("http://localhost:3000/")) {
  URL = "http://localhost:5000";
} else {
  URL = "https://one682.onrender.com";
}
export { URL };
export const token = localStorage.getItem("token");
