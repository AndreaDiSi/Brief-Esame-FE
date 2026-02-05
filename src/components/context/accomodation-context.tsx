// accomodation-context.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { THost } from "./host-context";
import { toast } from "sonner";
import type { TAccomodationWithNReservations } from "../accomodation/best-accomodation";

export type TAccomodation = {
    idAccomodation: number;
    accomodationName: string;
    nrooms: number;
    Host?: THost;
    hostId: number;
    nbedPlaces: number;
    floor: number;
    startDate: string;
    endDate: string;
    price: number;
    accomodationAddress: string;
}

export type TNewAccomodation = Omit<TAccomodation, "idAccomodation">;

interface AccomodationProviderProps {
    children: React.ReactNode;
}

export interface AccomodationContextType {
    accomodationData: TAccomodation[];
    addAccomodation: (newAccomodation: TNewAccomodation) => Promise<void>;
    deleteAccomodation: (id: number) => Promise<void>;
    updateAccomodation: (id: number, updated: TNewAccomodation) => Promise<void>;
    fetchBestAccomodation: () => Promise<TAccomodationWithNReservations>;
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


    const [accomodationData, setData] = useState<TAccomodation[]>([]);

    useEffect(() => {
        const fetchAccomodations = async () => {
            try {
                const res = await fetch(`${API_URL}/accomodations`);

                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

                // Convert data to json
                const json: TAccomodation[] = await res.json();
                setData(json);

            } catch (error) {
                console.error("Error fetching accomodations:", error);
            }
        }
        fetchAccomodations();
    }, []);

    //ha senso mettere che addAccomodation accetta TnewAccomodation? e poi fare il cast a TAccomodation?
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

            const newAccomodationResponse = await res.json();

            setData(prev => [...prev, newAccomodationResponse]);

        } catch (error) {
            console.error("Error adding accomodation:", error);
        }
    }

    const deleteAccomodation = async (id: number) => {
        const backup = accomodationData;

        // optimistic remove
        setData(prev =>
            prev.filter(item => item.idAccomodation !== id)
        );

        try {
            const res = await fetch(`${API_URL}/accomodations/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        } catch (error) {

            console.error("Delete failed, rollback:", error);
            setData(backup); // ripristina
        }
    };

    const updateAccomodation = async (id: number, updated: TNewAccomodation) => {
        try {
            const res = await fetch(`${API_URL}/accomodations/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updated),
            });
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            const updatedResponse: TAccomodation = await res.json();
            setData(prev => prev.map(item =>
                item.idAccomodation === id ? updatedResponse : item
            ));
        } catch (error) {
            console.error("Error updating accomodation:", error);
        }
    }

    const fetchBestAccomodation = async () => {
        const res = await fetch(`${API_URL}/bestAccomodations`);
        if (!res.ok) throw new Error("Failed to fetch stats");

        const best: TAccomodationWithNReservations = await res.json();
        console.log("Best Accomodation:", best);
        return best;
    };




    return (
        <AccomodationContext.Provider value={{ accomodationData, addAccomodation, deleteAccomodation, updateAccomodation, fetchBestAccomodation }}>
            {children}
        </AccomodationContext.Provider>
    );
};

export default AccomodationContext;