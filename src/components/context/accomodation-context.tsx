// accomodation-context.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { Host } from "./host-context";

export type TAccomodation = {
    idAccomodation: number;
    name: string;
    nrooms: number;
    Host?: Host;
    host: number;
    nbedPlaces: number;
    floor: number;
    startDate: string;  // ← rinominato per matchare il backend
    endDate: string;
    price: number;
    accomodationAddress: string;
}

export type TNewAccomodation = Omit<TAccomodation, "idAccomodation">;

interface AccomodationProviderProps {
    children: React.ReactNode;
}

export interface AccomodationContextType {
    data: TAccomodation[];
    addAccomodation: (newAccomodation: TNewAccomodation) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;

const AccomodationContext = createContext<AccomodationContextType | null>(null);

export const useAccomodation = () => {
    const context = useContext(AccomodationContext);
    if (!context)
        throw new Error("useAccomodation must be used within an AccomodationProvider");
    return context;
}

export const AccomodationProvider = ({
    children
}: AccomodationProviderProps) => {
    const [data, setData] = useState<TAccomodation[]>([]);

    useEffect(() => {
        const fetchAccomodations = async () => {
            try {
                const res = await fetch(`${API_URL}/accomodations`);
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                const json: TAccomodation[] = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching accomodations:", error);
            }
        }
        fetchAccomodations();
    }, []);

    const addAccomodation = async (newAccomodation: TNewAccomodation) => {
        try {
            const res = await fetch(`${API_URL}/accomodations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAccomodation),
            });
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            const newAccomodationResponse: TAccomodation = await res.json();
            setData(prev => [...prev, newAccomodationResponse]);
        } catch (error) {
            console.error("Error adding accomodation:", error);
        }
    }

    return (
        <AccomodationContext.Provider value={{ data, addAccomodation }}>
            {children}
        </AccomodationContext.Provider>
    );
};

export default AccomodationContext;