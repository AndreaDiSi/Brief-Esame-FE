import React, { createContext, useContext, useState, useEffect } from "react";

export type TReservation = {
    idReservation: number;
    reservationStartDate: string;
    reservationEndDate: string;
    idTenant: number;
    idAccomodation: number;
};

export type TNewReservation = Omit<TReservation, "idReservation">;

interface ReservationContextType {
    reservations: TReservation[];
    addReservation: (reservation: TNewReservation) => Promise<void>;
    updateReservation: (id: number, reservation: TNewReservation) => Promise<void>;
    deleteReservation: (id: number) => Promise<boolean>;
    getLastReservation: (idTenant: number) => Promise<TReservation | null>;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservation = () => {
    const context = useContext(ReservationContext);
    if (!context) throw new Error("useReservation must be used within ReservationProvider");
    return context;
};

export const ReservationProvider = ({ children }: { children: React.ReactNode }) => {
    const [reservations, setReservations] = useState<TReservation[]>([]);

    const fetchReservations = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/v1/reservations");
            const data = await res.json();
            setReservations(data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    useEffect(() => { fetchReservations(); }, []);

    const addReservation = async (reservation: TNewReservation) => {
        await fetch("http://localhost:8080/api/v1/reservations", {
            method: "POST",
            body: JSON.stringify(reservation),
            headers: { "Content-Type": "application/json" }
        });
        await fetchReservations();
    };

    const updateReservation = async (id: number, reservation: TNewReservation) => {
        await fetch(`http://localhost:8080/api/v1/reservations/${id}`, {
            method: "PUT",
            body: JSON.stringify(reservation),
            headers: { "Content-Type": "application/json" }
        });
        await fetchReservations();
    };

    const deleteReservation = async (id: number) => {
        const res = await fetch(`http://localhost:8080/api/v1/reservations/${id}`, { method: "DELETE" });
        if (res.ok) {
            await fetchReservations();
            return true;
        }
        return false;
    };
    const getLastReservation = async (idTenant: number): Promise<TReservation | null> => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/tenants/${idTenant}/last-reservation`);
            if (!res.ok) {
                if (res.status === 404) return null;
                throw new Error("Errore nel recupero dell'ultima prenotazione");
            }
            return await res.json();
        } catch (error) {
            console.error("Error fetching last reservation:", error);
            return null;
        }
    };

    return (
        <ReservationContext.Provider value={{ reservations, addReservation, updateReservation, deleteReservation, getLastReservation }}>
            {children}
        </ReservationContext.Provider>
    );
};

