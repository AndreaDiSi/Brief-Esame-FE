import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/layout";
import Homepage from "./components/homepage";
import Accomodation from "./components/accomodation/accomodation";
import Host from "./components/host/host";
import Tenant from "./components/tenant/tenant";
import Reservation from "./components/reservation/reservation";
import Feedback from "./components/feedback/feedback";

export function App() {
    return (
        <BrowserRouter>

            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/accomodations" element={<Accomodation />} />
                    <Route path="/hosts" element={<Host />} />
                    <Route path="/tenants" element={<Tenant />} />
                    <Route path="/reservations" element={<Reservation />} />
                    <Route path="/feedbacks" element={<Feedback />} />
                </Route>
            </Routes>

        </BrowserRouter>
    )
}

export default App;