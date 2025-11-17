import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppToaster from "./utils/toaster.jsx";
import { Provider } from "react-redux";
import store, { persistor } from "./Redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="w-full h-screen flex items-center justify-center text-[#00fff7]">
            Loading...
          </div>
        }
        persistor={persistor}
      >
        <App />
        <AppToaster />
      </PersistGate>
    </Provider>
  </>
);
