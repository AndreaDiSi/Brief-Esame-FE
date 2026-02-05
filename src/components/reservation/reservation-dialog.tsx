import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useReservation } from "../context/reservation-context"
import { useTenant } from "../context/tenant-context"
import { useAccomodation } from "../context/accomodation-context"

import { useState } from "react"
import TenantAutocomplete from "../tenant/autocomplete-tenant"
import AccomodationAutocomplete from "../accomodation/autocomplete-accomodation"



export const reservationSchema = z.object({
    reservationStartDate: z.string().min(1, "Start date is required"),
    reservationEndDate: z.string().min(1, "End date is required"),
    idTenant: z.number({ error: "Please select a Tenant" }).min(1, "Tenant is required"),
    idAccomodation: z.number({ error: "Please select an Accomodation" }).min(1, "Accomodation is required"),
}).refine(
    (data) => new Date(data.reservationEndDate) > new Date(data.reservationStartDate),
    {
        message: "End date must be after start date",
        path: ["endDate"],
    }
);

export type ReservationFormData = z.infer<typeof reservationSchema>;

function ReservationDialog() {
    const { addReservation } = useReservation();
    const { tenantData } = useTenant();
    const { accomodationData } = useAccomodation();
    const [searchTermAccomodation, setSearchTermAccomodation] = useState('');
    const [searchTermTenant, setSearchTermTenant] = useState('');
    const [open, setOpen] = useState(false);

    const form = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        mode: "onChange",
    })
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = form


    const onSubmit = async (formData: ReservationFormData) => {
        try {
            await addReservation(formData);
            setOpen(false);
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
        }
    }

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
    return (
        <Dialog>
            <DialogTrigger render={
                <Button className="bg-primary">
                    <Plus /> New Reservation
                </Button>}>
            </DialogTrigger>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add New Reservation</DialogTitle>
                        <DialogDescription className="mb-2">
                            Select tenant, accommodation and dates.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-2 gap-4">
                        <Field>
                            <Label>Tenant ID</Label>
                            <TenantAutocomplete
                                onSelect={(tenant) => {
                                    form.setValue("idTenant", tenant.idTenant)
                                }}
                            />
                            <input type="hidden" {...register("idTenant", { valueAsNumber: true })} />

                            {errors.idTenant && <p className="text-red-500">{errors.idTenant.message}</p>}


                        </Field>

                        <Field>
                            <Label>Accomodation ID</Label>
                            <AccomodationAutocomplete
                                onSelect={(accomodation) => {
                                    form.setValue("idAccomodation", accomodation.idAccomodation)
                                }}
                            />
                            <input type="hidden" {...register("idAccomodation", { valueAsNumber: true })} />

                            {errors.idAccomodation && <p className="text-red-500">{errors.idAccomodation.message}</p>}

                        </Field>

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
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ReservationDialog;