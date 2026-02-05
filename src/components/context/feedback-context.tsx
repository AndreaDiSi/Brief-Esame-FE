import { createContext, useContext, useEffect, useState } from "react";
import {toast} from "sonner";

export type TFeedback = {
    idFeed: number;
    title: string;
    textFeedback: string;
    points: number; 
    idReservation: number;
}

export type TNewFeedback = Omit<TFeedback, "idFeed">;

interface FeedbackProviderProps {
    children: React.ReactNode;
}

export interface FeedbackContextType {
    feedbackData: TFeedback[];
    addFeedback: (newFeedback: TNewFeedback) => Promise<void>;
    deleteFeedback: (id: number) => Promise<void>;
    updateFeedback: (id: number, updated: TNewFeedback) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context)
        throw new Error("useFeedback must be used within a FeedbackProvider");
    return context;
}

export const FeedbackProvider = ({ children }: FeedbackProviderProps) => {
    const [feedbackData, setData] = useState<TFeedback[]>([]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await fetch(`${API_URL}/feedback`);
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                const json: TFeedback[] = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching feedback:", error);
                toast.error("Failed to load feedback");
            }
        }
        fetchFeedback();
    }, []);

    const addFeedback = async (newFeedback: TNewFeedback) => {
        try {
            const res = await fetch(`${API_URL}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newFeedback),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }
            
            const newFeedbackResponse: TFeedback = await res.json();
            setData(prev => [newFeedbackResponse, ...prev]);
            toast.success("Feedback added successfully!");
        } catch (error) {
            console.error("Error adding feedback:", error);
            toast.error(error instanceof Error ? error.message : "Failed to add feedback");
            throw error;
        }
    }

    const deleteFeedback = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/feedback/${id}`, {
                method: "DELETE",
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }
            
            setData(prev => prev.filter(item => item.idFeed !== id));
            toast.success("Feedback deleted successfully!");
        } catch (error) {
            console.error("Error deleting feedback:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete feedback");
            throw error;
        }
    }

    const updateFeedback = async (id: number, updated: TNewFeedback) => {
        try {
            const res = await fetch(`${API_URL}/feedback/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updated),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }
            
            const updatedResponse: TFeedback = await res.json();
            setData(prev => prev.map(item => 
                item.idFeed === id ? updatedResponse : item
            ));
            toast.success("Feedback updated successfully!");
        } catch (error) {
            console.error("Error updating feedback:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update feedback");
            throw error;
        }
    }

    return (
        <FeedbackContext.Provider value={{ feedbackData, addFeedback, deleteFeedback, updateFeedback }}>
            {children}
        </FeedbackContext.Provider>
    );
};

export default FeedbackContext;