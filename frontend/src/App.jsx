import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />

      {/* Global Toast System */}
      <Toaster
        position="top-right"
        containerStyle={{
          top: 85,
          right: 20,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#0f172a",
            color: "#fff",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;