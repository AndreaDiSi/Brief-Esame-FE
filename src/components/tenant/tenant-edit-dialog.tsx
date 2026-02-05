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
import { type TTenant, useTenant, type TNewTenant } from "../context/tenant-context"

const tenantSchema = z.object({
    tenantName: z.string().min(1, "Name is required").max(20, "Name is too long"),
    surname: z.string().min(1, "Surname is required").max(20, "Surname is too long"),
    email: z.string().email("Invalid email format").max(255, "Email is too long"),
    tenantAddress: z.string().min(1, "Address is required").max(50, "Address is too long"),
});

type TenantFormData = z.infer<typeof tenantSchema>;

interface TenantEditDialogProps {
    tenant: TTenant
    open: boolean
    onClose: () => void
}

function TenantEditDialog({ tenant, open, onClose }: TenantEditDialogProps) {
    const { updateTenant } = useTenant()
    const form = useForm<TenantFormData>({
        resolver: zodResolver(tenantSchema),
        mode: "onChange",
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = form

    // Carica i dati del tenant nel form quando il dialog si apre
    useEffect(() => {
        if (open && tenant) {
            reset({
                tenantName: tenant.tenantName,
                surname: tenant.surname,
                email: tenant.email,
                tenantAddress: tenant.tenantAddress,
            })
        }
    }, [open, tenant, reset])

    const onSubmit = async (formData: TenantFormData) => {
        const payload: TNewTenant = {
            tenantName: formData.tenantName,
            surname: formData.surname,
            email: formData.email,
            tenantAddress: formData.tenantAddress,
        }

        await updateTenant(tenant.idTenant, payload)
        
        toast.success("Tenant updated", {
            description: `${formData.tenantName} ${formData.surname} has been successfully updated.`,
        })
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Tenant</DialogTitle>
                        <DialogDescription className="mb-2">
                            Update the tenant's details below.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-2 gap-4">
                        <Field>
                            <Label>Name</Label>
                            <Input {...register("tenantName")} />
                            {errors.tenantName && (
                                <p className="text-red-500 text-sm">{errors.tenantName.message}</p>
                            )}
                        </Field>

                        <Field>
                            <Label>Surname</Label>
                            <Input {...register("surname")} />
                            {errors.surname && (
                                <p className="text-red-500 text-sm">{errors.surname.message}</p>
                            )}
                        </Field>

                        <Field className="col-span-2">
                            <Label>Email</Label>
                            <Input type="email" {...register("email")} />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </Field>

                        <Field className="col-span-2">
                            <Label>Address</Label>
                            <Input {...register("tenantAddress")} />
                            {errors.tenantAddress && (
                                <p className="text-red-500 text-sm">{errors.tenantAddress.message}</p>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TenantEditDialog;