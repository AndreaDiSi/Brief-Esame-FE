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
import { useTenant, type TNewTenant } from "../context/tenant-context"


const tenantSchema = z.object({
    tenantName: z.string().min(1, "Name is required").max(20, "Name is too long"),
    surname: z.string().min(1, "Surname is required").max(20, "Surname is too long"),
    email: z.string().email("Invalid email format").max(255, "Email is too long"),
    tenantAddress: z.string().min(1, "Address is required").max(50, "Address is too long"),
});

type TenantFormData = z.infer<typeof tenantSchema>;

function TenantDialog() {
    const { addTenant } = useTenant();
    
    const form = useForm<TenantFormData>({
        resolver: zodResolver(tenantSchema),
        mode: "onChange",
        defaultValues: {
            tenantName: "",
            surname: "",
            email: "",
            tenantAddress: "",
        }
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = form

    const onSubmit = async (formData: TenantFormData) => {
        const payload: TNewTenant = {
            tenantName: formData.tenantName,
            surname: formData.surname,
            email: formData.email,
            tenantAddress: formData.tenantAddress,
        }

        await addTenant(payload);
        
        reset();
        
    }

    return (
        <Dialog>
            <DialogTrigger render={
                <Button className="bg-primary">
                    <Plus /> New Tenant
                </Button>}>
            </DialogTrigger>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add New Tenant</DialogTitle>
                        <DialogDescription className="mb-2">
                            Fill in the details below to add a new tenant to the system.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-2 gap-4">
                        <Field>
                            <Label>Name</Label>
                            <Input {...register("tenantName")} placeholder="John" />
                            {errors.tenantName && (
                                <p className="text-red-500 text-sm">{errors.tenantName.message}</p>
                            )}
                        </Field>

                        <Field>
                            <Label>Surname</Label>
                            <Input {...register("surname")} placeholder="Doe" />
                            {errors.surname && (
                                <p className="text-red-500 text-sm">{errors.surname.message}</p>
                            )}
                        </Field>

                        <Field className="col-span-2">
                            <Label>Email</Label>
                            <Input type="email" {...register("email")} placeholder="john.doe@example.com" />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </Field>

                        <Field className="col-span-2">
                            <Label>Address</Label>
                            <Input {...register("tenantAddress")} placeholder="Via Roma 123, Milano" />
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
                            {isSubmitting ? "Saving..." : "Save Tenant"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TenantDialog;