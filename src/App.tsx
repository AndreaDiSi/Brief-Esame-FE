import { ComponentExample } from "@/components/component-example";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/layout";
import Homepage from "./components/homepage";
import Accomodation from "./components/accomodation";
import { AccomodationProvider } from "./components/context/accomodation-context";

export function App() {
    return (
        <BrowserRouter>
            
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/accomodations" element={<Accomodation />} />
                    </Route>
                </Routes>
            
        </BrowserRouter>
    )
}

export default App;