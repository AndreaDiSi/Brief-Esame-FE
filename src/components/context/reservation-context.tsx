import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export type TReservation = {
    idReservation: number;
    reservationStartDate: string;
    reservationEndDate: string;
    idTenant: number;
    idAccomodation: number;
};

export type TNewReservation = Omit<TReservation, "idReservation">;

interface ReservationProviderProps {
    children: React.ReactNode;
}

export interface ReservationContextType {
    reservations: TReservation[];
    addReservation: (reservation: TNewReservation) => Promise<void>;
    updateReservation: (id: number, reservation: TNewReservation) => Promise<void>;
    deleteReservation: (id: number) => Promise<void>;
    getLastReservation: (idTenant: number) => Promise<TReservation | null>;
}

const API_URL = import.meta.env.VITE_API_URL;

const ReservationContext = createContext<ReservationContextType | null>(null);

export const useReservation = () => {
    const context = useContext(ReservationContext);
    if (!context) throw new Error("useReservation must be used within a ReservationProvider");
    return context;
};

export const ReservationProvider = ({ children }: ReservationProviderProps) => {
    const [reservations, setReservations] = useState<TReservation[]>([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await fetch(`${API_URL}/reservations`);
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                const json: TReservation[] = await res.json();
                setReservations(json);
            } catch (error) {
                console.error("Error fetching reservations:", error);
                toast.error("Failed to load reservations");
            }
        };
        fetchReservations();
    }, []);

    const addReservation = async (reservation: TNewReservation) => {
        try {
            const res = await fetch(`${API_URL}/reservations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservation),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error("Error Adding new reservation");
            }
            
            const newReservation: TReservation = await res.json();
            setReservations(prev => [newReservation, ...prev]);
            toast.success("Reservation added successfully!");

        } catch (error) {
            
            toast.error(error instanceof Error ? error.message : "Failed to add reservation");
            throw error;
        }
    };

    const updateReservation = async (id: number, reservation: TNewReservation) => {
        try {
            const res = await fetch(`${API_URL}/reservations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservation),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }
                
            const updated: TReservation = await res.json();
            setReservations(prev => prev.map(r => r.idReservation === id ? updated : r));
            toast.success("Reservation updated successfully!");
        } catch (error) {
            console.error("Error updating reservation:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update reservation");
            throw error;
        }
    };

    const deleteReservation = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/reservations/${id}`, { method: "DELETE" });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }
            
            setReservations(prev => prev.filter(r => r.idReservation !== id));
            toast.success("Reservation deleted successfully!");
        } catch (error) {
            console.error("Error deleting reservation:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete reservation");
            throw error;
        }
    };

    const getLastReservation = async (idTenant: number): Promise<TReservation | null> => {
        try {
            const res = await fetch(`${API_URL}/tenants/${idTenant}/last-reservation`);
            if (!res.ok) {
                if (res.status === 404) return null;
                throw new Error(`HTTP error: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            console.error("Error fetching last reservation:", error);
            toast.error("Failed to fetch last reservation");
            return null;
        }
    };

    return (
        <ReservationContext.Provider
            value={{ reservations, addReservation, updateReservation, deleteReservation, getLastReservation }}
        >
            {children}
        </ReservationContext.Provider>
    );
};

export default ReservationContext;