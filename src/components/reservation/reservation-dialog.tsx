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
import { toast } from "sonner"
import { useState } from "react"



export const reservationSchema = z.object({
    reservationStartDate: z.string().min(1, "Start date is required"),
    reservationEndDate: z.string().min(1, "End date is required"),
    idTenant: z.number({error: "Please select a Tenant"}).min(1, "Tenant is required"),
    idAccomodation: z.number({error: "Please select an Accomodation"}).min(1, "Accomodation is required"),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

function ReservationDialog() {
    const { addReservation } = useReservation();
    const { tenantData } = useTenant();
    const { accomodationData } = useAccomodation();
    const [searchTermAccomodation, setSearchTermAccomodation] = useState('');
    const [searchTermTenant, setSearchTermTenant] = useState('');


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        mode: "onChange",
    })

    const onSubmit = async (formData: ReservationFormData) => {
        await addReservation(formData);
        toast.success("Reservation created", {
            description: "The booking has been successfully recorded.",
        })
        reset();
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
                <Button className="bg-green-500 hover:bg-green-600">
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
                        <Field className="col-span-2">
                            <Label>Tenant</Label>
                            <input
                                type="text"
                                placeholder="Search by name or ID"
                                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTermTenant}
                                onChange={(e) => setSearchTermTenant(e.target.value)}
                            />
                            <select
                                className="border border-black"
                                {...register("idTenant", { valueAsNumber: true })}
                            >
                                <option value="">-- Select a Tenant --</option>
                                {filteredDataTenant.map(tenant => (
                                    <option key={tenant.idTenant} value={tenant.idTenant}>
                                        {tenant.tenantName} {tenant.surname} (ID: {tenant.idTenant})
                                    </option>
                                ))}
                            </select>
                            {errors.idTenant&& <p className="text-red-500 text-sm">{errors.idTenant.message}</p>}
                        </Field>

                        <Field className="col-span-2">
                            <Label>Accomodation</Label>
                            <input
                                type="text"
                                placeholder="Search by name or ID"
                                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTermAccomodation}
                                onChange={(e) => setSearchTermAccomodation(e.target.value)}
                            />
                            <select
                                {...register("idAccomodation", { valueAsNumber: true })}
                                className="border border-black"
                            >
                                <option value="">-- Select an Accomodation --</option>
                                {filteredDataAccomodation.map(accomodation => (
                                    <option key={accomodation.idAccomodation} value={accomodation.idAccomodation}>
                                        {accomodation.accomodationName} (ID: {accomodation.idAccomodation})
                                    </option>
                                ))}
                            </select>
                            {errors.idAccomodation && <p className="text-red-500 text-sm">{errors.idAccomodation.message}</p>}
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
                        <Button type="submit" disabled={isSubmitting} className="bg-green-500 hover:bg-green-600">
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ReservationDialog;