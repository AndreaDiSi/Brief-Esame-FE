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
import { useEffect } from "react"
import { type THost, useHost, type TNewHost } from "../context/host-context"

const hostSchema = z.object({
    hostName: z.string().min(1, "Name is required").max(20, "Name is too long"),
    surname: z.string().min(1, "Surname is required").max(20, "Surname is too long"),
    email: z.string().email("Invalid email format").max(255, "Email is too long"),
    hostAddress: z.string().min(1, "Address is required").max(50, "Address is too long"),
    isSuperhost: z.boolean()
});

type HostFormData = z.infer<typeof hostSchema>;

interface HostEditDialogProps {
    host: THost
    open: boolean
    onClose: () => void
}

function HostEditDialog({ host, open, onClose }: HostEditDialogProps) {
    const { updateHost } = useHost()
    const form = useForm<HostFormData>({
        resolver: zodResolver(hostSchema),
        mode: "onChange",
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = form

    const isSuperhost = watch("isSuperhost")

    useEffect(() => {
        if (open && host) {
            reset({
                hostName: host.hostName,
                surname: host.surname,
                email: host.email,
                hostAddress: host.hostAddress,
                isSuperhost: host.isSuperhost,
            })
        }
    }, [open, host, reset])

    const onSubmit = async (formData: HostFormData) => {
        const payload: TNewHost = {
            hostName: formData.hostName,
            surname: formData.surname,
            email: formData.email,
            hostAddress: formData.hostAddress,
            isSuperhost: formData.isSuperhost,
        }

        console.log("Sending payload:", payload)

        await updateHost(host.idHost, payload)
        toast.success("Host updated", {
            description: `${formData.hostName} ${formData.surname} has been successfully updated.`,
        })
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Host</DialogTitle>
                        <DialogDescription className="mb-2">
                            Update the details below.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-2 gap-4">
                        <Field>
                            <Label>Name</Label>
                            <Input {...register("hostName")} />
                            {errors.hostName && <p className="text-red-500 text-sm">{errors.hostName.message}</p>}
                        </Field>

                        <Field>
                            <Label>Surname</Label>
                            <Input {...register("surname")} />
                            {errors.surname && <p className="text-red-500 text-sm">{errors.surname.message}</p>}
                        </Field>

                        <Field className="col-span-2">
                            <Label>Email</Label>
                            <Input type="email" {...register("email")} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </Field>

                        <Field className="col-span-2">
                            <Label>Address</Label>
                            <Input {...register("hostAddress")} />
                            {errors.hostAddress && <p className="text-red-500 text-sm">{errors.hostAddress.message}</p>}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
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

export default HostEditDialog