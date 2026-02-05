import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export type TTenant = {
    idTenant: number;
    email: string;
    tenantName: string;
    surname: string;
    tenantAddress: string;
}

export type TNewTenant = Omit<TTenant, "idTenant">;

interface TenantProviderProps {
    children: React.ReactNode;
}

export interface TenantContextType {
    tenantData: TTenant[];
    addTenant: (newTenant: TNewTenant) => Promise<void>;
    deleteTenant: (id: number) => Promise<void>;
    updateTenant: (id: number, updated: TNewTenant) => Promise<void>;
    fetchTopFiveTenants: () => Promise<TTenant[]>;
}

const API_URL = import.meta.env.VITE_API_URL;

const TenantContext = createContext<TenantContextType | null>(null);

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (!context)
        throw new Error("useTenant must be used within a TenantProvider");
    return context;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
    const [tenantData, setData] = useState<TTenant[]>([]);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const res = await fetch(`${API_URL}/tenants`);
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                const json: TTenant[] = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching tenants:", error);
                toast.error("Failed to load tenants");
            }
        }
        fetchTenants();
    }, []);

    const addTenant = async (newTenant: TNewTenant) => {
        try {
            const res = await fetch(`${API_URL}/tenants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTenant),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }
            
            const newTenantResponse: TTenant = await res.json();
            setData(prev => [newTenantResponse, ...prev]);
            toast.success("Tenant added successfully!");
        } catch (error) {
            console.error("Error adding tenant:", error);
            toast.error(error instanceof Error ? error.message : "Failed to add tenant");
            throw error;
        }
    }

    const deleteTenant = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/tenants/${id}`, {
                method: "DELETE",
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `HTTP error: ${res.status}`);
            }
            
            setData(prev => prev.filter(item => item.idTenant !== id));
            toast.success("Tenant deleted successfully!");
        } catch (error) {
            console.error("Error deleting tenant:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete tenant");
            throw error;
        }
    }

    const updateTenant = async (id: number, updated: TNewTenant) => {
        try {
            const res = await fetch(`${API_URL}/tenants/${id}`, {
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
            
            const updatedResponse: TTenant = await res.json();
            setData(prev => prev.map(item => 
                item.idTenant === id ? updatedResponse : item
            ));
            toast.success("Tenant updated successfully!");
        } catch (error) {
            console.error("Error updating tenant:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update tenant");
            throw error;
        }
    }

    const fetchTopFiveTenants = async () => {
        try {
            const res = await fetch(`${API_URL}/tenants/topfivetenants`);
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to fetch top five tenants");
            }
            
            return res.json();
        } catch (error) {
            console.error("Error fetching top five tenants:", error);
            toast.error(error instanceof Error ? error.message : "Failed to fetch top five tenants");
            throw error;
        }
    };

    return (
        <TenantContext.Provider value={{ tenantData, addTenant, deleteTenant, updateTenant, fetchTopFiveTenants }}>
            {children}
        </TenantContext.Provider>
    );
};

export default TenantContext;