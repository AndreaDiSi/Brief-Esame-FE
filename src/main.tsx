import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { AccomodationProvider } from "./components/context/accomodation-context.tsx"
import { HostProvider } from "./components/context/host-context.tsx"
import { TenantProvider } from "./components/context/tenant-context.tsx"
import { ReservationProvider } from "./components/context/reservation-context.tsx"
import { FeedbackProvider } from "./components/context/feedback-context.tsx"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccomodationProvider>
      <HostProvider>
        <TenantProvider>
          <ReservationProvider>
            <FeedbackProvider>
              <TooltipProvider>
                <App />
              </TooltipProvider>
            </FeedbackProvider>
          </ReservationProvider>
        </TenantProvider>
      </HostProvider>
    </AccomodationProvider>
  </StrictMode>
)
