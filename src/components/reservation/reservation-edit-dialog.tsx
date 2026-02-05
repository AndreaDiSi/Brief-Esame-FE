import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { type TReservation, useReservation, type TNewReservation } from "../context/reservation-context"
import { useTenant } from "../context/tenant-context"
import { useAccomodation } from "../context/accomodation-context"
import { reservationSchema } from "./reservation-dialog"


type ReservationFormData = z.infer<typeof reservationSchema>;

interface Props {
    reservation: TReservation
    open: boolean
    onClose: () => void
}

function ReservationEditDialog({ reservation, open, onClose }: Props) {
    const { updateReservation } = useReservation()
    const { tenantData } = useTenant()
    const { accomodationData } = useAccomodation()
    const [searchTermAccomodation, setSearchTermAccomodation] = useState('');
    const [searchTermTenant, setSearchTermTenant] = useState('');

    const filteredDataTenant = tenantData.filter(item => {
        if (searchTermTenant === '') {
            return null;
        }
        const idTenanttoString = item.idTenant.toString();
        return (
            item.tenantName.toLowerCase().includes(searchTermTenant.toLowerCase()) ||
            item.surname.toLowerCase().includes(searchTermTenant.toLowerCase()) ||
            idTenanttoString.toLowerCase().includes(searchTermTenant.toLowerCase())
        );
    });

    const filteredDataAccomodation = accomodationData.filter(item => {
        if (searchTermAccomodation === '') {
            return null;
        }
        const idAccomodationtoString = item.idAccomodation.toString();
        return (
            item.accomodationName.toLowerCase().includes(searchTermAccomodation.toLowerCase()) ||
            idAccomodationtoString.toLowerCase().includes(searchTermAccomodation.toLowerCase())
        );
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        mode: "onChange",
    })


    useEffect(() => {
        if (open && reservation) {
            reset({
                reservationStartDate: reservation.reservationStartDate,
                reservationEndDate: reservation.reservationEndDate,
                idTenant: reservation.idTenant,
                idAccomodation: reservation.idAccomodation,
            })
        }
    }, [open, reservation, reset])

    const onSubmit = async (formData: ReservationFormData) => {
        await updateReservation(reservation.idReservation, formData)
        toast.success("Reservation updated")
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Reservation</DialogTitle>
                        <DialogDescription className="mb-2">Update booking details.</DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-2 gap-4">
                        {/* Select Tenant ed Accomodation come nel create */}
                        

                        <Field>
                            <Label>Start Date</Label>
                            <Input type="date" {...register("reservationStartDate")} />
                        </Field>

                        <Field>
                            <Label>End Date</Label>
                            <Input type="date" {...register("reservationEndDate")} />
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button type="submit" disabled={isSubmitting} className="bg-yellow-500 hover:bg-yellow-600">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ReservationEditDialog;