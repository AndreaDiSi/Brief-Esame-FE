// AccomodationDialog.tsx
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
import { useAccomodation, type TNewAccomodation } from "./context/accomodation-context"

const accomodationSchema = z.object({
    accomodationName: z.string().min(1, "Name is required").max(30, "Name is too long"),
    nRooms: z.number({ error: "There must be at least one room" }).min(1, "There must be at least one room"),
    nBedPlaces: z.number({ error: "There must be at least one bed place" }).min(1, "There must be at least one bed place"),
    host: z.number({ error: "Host ID is required" }).min(1, "Host ID must be at least 1"),
    address: z.string().min(6, "Address is required").max(100, "Address is too long"),
    floor: z.number().min(0, "Floor must be 0 or higher"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    price: z.number().min(10, "Price must be at least 10").max(50000, "Price must be at most 50000"),
}).refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    {
        message: "End date must be after start date",
        path: ["endDate"],
    }
);

type AccomodationFormData = z.infer<typeof accomodationSchema>;

function AccomodationDialog() {
    const { addAccomodation } = useAccomodation();
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

    const onSubmit = async (formData: AccomodationFormData) => {
        // Formatta le date come TIMESTAMP che il backend si aspetta
        const payload: TNewAccomodation = {
            name: formData.accomodationName,
            nrooms: formData.nRooms,
            nbedPlaces: formData.nBedPlaces,
            host: formData.host,
            accomodationAddress: formData.address,
            floor: formData.floor,
            startDate: formData.startDate,  
            endDate: formData.endDate,        
            price: formData.price,
        }

        console.log("Sending payload:", payload);  // debug
        await addAccomodation(payload);
        reset();
    }

    const start = watch("startDate")

    return (
        <Dialog>
            <DialogTrigger render={
                <Button className="bg-green-500 hover:bg-green-600">
                    <Plus /> New Accomodation
                </Button>}>
            </DialogTrigger>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add New Accomodation</DialogTitle>
                        <DialogDescription className="mb-2">
                            Fill in the details below to add a new accomodation.
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
                            <Label>Host ID</Label>
                            <Input type="number" {...register("host", { valueAsNumber: true })} min={1} />
                            {errors.host && <p className="text-red-500">{errors.host.message}</p>}
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
                            className="bg-green-500 hover:bg-green-600"
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AccomodationDialog;