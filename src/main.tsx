import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { AccomodationProvider } from "./components/context/accomodation-context.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccomodationProvider>
      <App />
    </AccomodationProvider>
  </StrictMode>
)
