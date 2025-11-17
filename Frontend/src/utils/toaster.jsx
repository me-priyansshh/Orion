import { Toaster } from "react-hot-toast";

const AppToaster = () => {
  return (
    <Toaster
      position="bottom-right" // bottom-right placement
      toastOptions={{
        duration: 4000,
        style: {
          background: "rgba(0,0,0,0.7)", // dark glassy background
          fontWeight: "bold",
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: "1rem",
          letterSpacing: "0.5px",
          borderRadius: "12px",
          padding: "14px 24px",
        },
        success: {
          style: {
            color: "#00ff00", // neon green text
            border: "1px solid #00ff00",
            boxShadow: "0 0 8px #00ff00, 0 0 15px #33ff33, 0 0 20px #00cc00",
            textShadow:
              "0 0 3px #00ff00, 0 0 6px #33ff33, 0 0 10px #00cc00",
          },
          iconTheme: {
            primary: "#00ff00",
            secondary: "#0e0f13",
          },
        },
        error: {
          style: {
            color: "#ff0000", // neon red text
            border: "1px solid #ff0000",
            boxShadow: "0 0 8px #ff0000, 0 0 15px #ff4b4b, 0 0 20px #cc0000",
            textShadow:
              "0 0 3px #ff0000, 0 0 6px #ff4b4b, 0 0 10px #cc0000",
          },
          iconTheme: {
            primary: "#ff0000",
            secondary: "#0e0f13",
          },
        },
      }}
    />
  );
};

export default AppToaster;
