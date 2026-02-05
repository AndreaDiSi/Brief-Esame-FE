// AccomodationEditDialog.tsx
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
import { useAccomodation, type TAccomodation, type TNewAccomodation } from "../context/accomodation-context"
import { toast } from "sonner"
import { useEffect } from "react"
import { accomodationSchema } from "./accomodation-dialog"
import { useHost } from "../context/host-context"


type AccomodationFormData = z.infer<typeof accomodationSchema>;

interface AccomodationEditDialogProps {
    accomodation: TAccomodation
    open: boolean
    onClose: () => void
}

// Formatta la data da TIMESTAMP a "yyyy-MM-dd" per l'input type=date
function formatDateForInput(dateString: string): string {
    return dateString.split("T")[0]
}

function AccomodationEditDialog({ accomodation, open, onClose }: AccomodationEditDialogProps) {
    const { updateAccomodation } = useAccomodation()
    const form = useForm<AccomodationFormData>({
        resolver: zodResolver(accomodationSchema),
        mode: "onChange",
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = form

    // Quando il dialog si apre, popola il form con i dati esistenti
    useEffect(() => {
        if (open && accomodation) {
            reset({
                accomodationName: accomodation.accomodationName,
                nRooms: accomodation.nrooms,
                nBedPlaces: accomodation.nbedPlaces,
                hostId: accomodation.hostId,
                address: accomodation.accomodationAddress,
                floor: accomodation.floor,
                startDate: formatDateForInput(accomodation.startDate),
                endDate: formatDateForInput(accomodation.endDate),
                price: accomodation.price,
            })
        }
    }, [open, accomodation, reset])

    const onSubmit = async (formData: AccomodationFormData) => {
        const payload: TNewAccomodation = {
            accomodationName: formData.accomodationName,
            nrooms: formData.nRooms,
            nbedPlaces: formData.nBedPlaces,
            hostId: formData.hostId,
            accomodationAddress: formData.address,
            floor: formData.floor,
            startDate: formData.startDate,
            endDate: formData.endDate,
            price: formData.price,
        }

        console.log("Sending payload:", payload)

        await updateAccomodation(accomodation.idAccomodation, payload)
        toast.success("Accomodation updated", {
            description: `${formData.accomodationName} has been successfully updated.`,
        })
        onClose()
    }

    const start = watch("startDate")


    const { data } = useHost();
    

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Accomodation</DialogTitle>
                        <DialogDescription className="mb-2">
                            Update the details below.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <Label>Name</Label>
                            <Input {...register("accomodationName")} />
                            {errors.accomodationName && <p className="text-red-500">{errors.accomodationName.message}</p>}
                        </Field>

                        <Field>
                            <Label>Rooms</Label>
                            <Input type="number" {...register("nRooms", { valueAsNumber: true })} min={1} />
                            {errors.nRooms && <p className="text-red-500">{errors.nRooms.message}</p>}
                        </Field>

                        <Field>
                            <Label>Bed Places</Label>
                            <Input type="number" {...register("nBedPlaces", { valueAsNumber: true })} min={1} />
                            {errors.nBedPlaces && <p className="text-red-500">{errors.nBedPlaces.message}</p>}
                        </Field>

                        <Field>
                            <Label>Address</Label>
                            <Input {...register("address")} />
                            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
                        </Field>

                        <Field>
                            <Label>Floor</Label>
                            <Input type="number" {...register("floor", { valueAsNumber: true })} min={0} />
                            {errors.floor && <p className="text-red-500">{errors.floor.message}</p>}
                        </Field>

                        <Field>
                            <Label>Start Date</Label>
                            <Input type="date" {...register("startDate")} />
                            {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
                        </Field>

                        <Field>
                            <Label>End Date</Label>
                            <Input type="date" {...register("endDate")} min={start} />
                            {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}
                        </Field>

                        <Field>
                            <Label>Price</Label>
                            <Input type="number" {...register("price", { valueAsNumber: true })} min={10} />
                            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-2">
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-yellow-500 hover:bg-yellow-600"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AccomodationEditDialog