// accomodation-context.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { Host } from "./host-context";
import { toast } from "sonner";

export type TAccomodation = {
    idAccomodation: number;
    accomodationName: string;
    nrooms: number;
    Host?: Host;
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
    data: TAccomodation[];
    addAccomodation: (newAccomodation: TNewAccomodation) => Promise<void>;
    deleteAccomodation: (id: number) => Promise<void>;
    updateAccomodation: (id: number, updated: TNewAccomodation) => Promise<void>;
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

    //TAccomodation is the type of the data fetched
    const [data, setData] = useState<TAccomodation[]>([]);

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
            toast.success("Accomodation added", {
                description: "The accomodation has been successfully added.",
            })

            setData(prev => [...prev, newAccomodationResponse]);

        } catch (error) {
            console.error("Error adding accomodation:", error);
        }
    }

    const deleteAccomodation = async (id: number) => {
        const backup = data;

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



    return (
        <AccomodationContext.Provider value={{ data, addAccomodation, deleteAccomodation, updateAccomodation }}>
            {children}
        </AccomodationContext.Provider>
    );
};

export default AccomodationContext;