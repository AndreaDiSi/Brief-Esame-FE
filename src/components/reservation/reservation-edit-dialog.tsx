import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useReservation, type TReservation, type TNewReservation } from "../context/reservation-context";
import { useTenant, type TTenant } from "../context/tenant-context";
import { useAccomodation, type TAccomodation } from "../context/accomodation-context";
import { reservationSchema } from "./reservation-dialog";


type ReservationFormData = z.infer<typeof reservationSchema>;

interface Props {
    reservation: TReservation;
    open: boolean;
    onClose: () => void;
}

function ReservationEditDialog({ reservation, open, onClose }: Props) {
    const { updateReservation } = useReservation();
    const { tenantData } = useTenant();
    const { accomodationData } = useAccomodation();

    const [selectedTenant, setSelectedTenant] = useState<TTenant | null>(null);
    const [selectedAccomodation, setSelectedAccomodation] = useState<TAccomodation | null>(null);

    const form = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        mode: "onChange",
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = form;

    
    useEffect(() => {
        if (open && reservation) {
            const tenant = tenantData.find(t => t.idTenant === reservation.idTenant) || null;
            const accomodation = accomodationData.find(a => a.idAccomodation === reservation.idAccomodation) || null;

            setSelectedTenant(tenant);
            setSelectedAccomodation(accomodation);

            reset({
                reservationStartDate: reservation.reservationStartDate,
                reservationEndDate: reservation.reservationEndDate,
                idTenant: reservation.idTenant,
                idAccomodation: reservation.idAccomodation,
            });
        }
    }, [open, reservation, tenantData, accomodationData, reset]);

    const onSubmit = async (formData: ReservationFormData) => {
        if (!selectedTenant || !selectedAccomodation) {
            toast.error("Please select a tenant and an accomodation.");
            return;
        }

        const payload: TNewReservation = {
            reservationStartDate: formData.reservationStartDate,
            reservationEndDate: formData.reservationEndDate,
            idTenant: selectedTenant.idTenant,
            idAccomodation: selectedAccomodation.idAccomodation,
        };

        try {
            await updateReservation(reservation.idReservation, payload);
            toast.success("Reservation updated", {
                description: `Booking for ${selectedTenant.tenantName} ${selectedTenant.surname} has been updated.`,
            });
            onClose(); 
        } catch (error) {
            console.error(error);
            toast.error("Error updating reservation");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Reservation</DialogTitle>
                        <DialogDescription className="mb-2">
                            Update booking details.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-2 gap-4">
                        

                        <Field>
                            <Label>Start Date</Label>
                            <Input type="date" {...register("reservationStartDate")} />
                            {errors.reservationStartDate && <p className="text-red-500 text-sm">{errors.reservationStartDate.message}</p>}
                        </Field>

                        <Field>
                            <Label>End Date</Label>
                            <Input type="date" {...register("reservationEndDate")} />
                            {errors.reservationEndDate && <p className="text-red-500 text-sm">{errors.reservationEndDate.message}</p>}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button type="submit" disabled={isSubmitting} className="bg-primary">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ReservationEditDialog;
