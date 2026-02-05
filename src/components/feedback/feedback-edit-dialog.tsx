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
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useEffect } from "react"
import { useFeedback, type TFeedback, type TNewFeedback } from "../context/feedback-context"
import { useReservation } from "../context/reservation-context"

export const feedbackSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    textFeedback: z.string().min(1, "Feedback text is required"),
    points: z.number({error: "Please Insert a number between 1 and 5"}).min(1).max(5),
    idReservation: z.number({error: "Please select a Reservation"}).min(1),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackEditDialogProps {
    feedback: TFeedback
    open: boolean
    onClose: () => void
}

function FeedbackEditDialog({ feedback, open, onClose }: FeedbackEditDialogProps) {
    const { updateFeedback } = useFeedback()
    const { reservations } = useReservation()

    const form = useForm<FeedbackFormData>({
        resolver: zodResolver(feedbackSchema),
        mode: "onChange",
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = form

    // Popola il form quando il dialog si apre con i dati esistenti
    useEffect(() => {
        if (open && feedback) {
            reset({
                title: feedback.title,
                textFeedback: feedback.textFeedback,
                points: feedback.points,
                idReservation: feedback.idReservation,
            })
        }
    }, [open, feedback, reset])

    const onSubmit = async (formData: FeedbackFormData) => {
        const payload: TNewFeedback = {
            title: formData.title,
            textFeedback: formData.textFeedback,
            points: formData.points,
            idReservation: formData.idReservation,
        }

        await updateFeedback(feedback.idFeed, payload)
        
        toast.success("Feedback updated", {
            description: "The feedback has been successfully modified.",
        })
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Feedback</DialogTitle>
                        <DialogDescription className="mb-2">
                            Modify the details of the selected feedback.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="flex flex-col gap-4">
                        <Field>
                            <Label>Title</Label>
                            <Input {...register("title")} />
                            {errors.title && (
                                <p className="text-red-500 text-sm">{errors.title.message}</p>
                            )}
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label>Rating (1-5)</Label>
                                <Input 
                                    type="number" 
                                    {...register("points", { valueAsNumber: true })} 
                                    min={1} 
                                    max={5} 
                                />
                                {errors.points && (
                                    <p className="text-red-500 text-sm">{errors.points.message}</p>
                                )}
                            </Field>

                        
                        </div>

                        <Field>
                            <Label>Feedback Text</Label>
                            <Textarea 
                                {...register("textFeedback")} 
                                className="min-h-30"
                            />
                            {errors.textFeedback && (
                                <p className="text-red-500 text-sm">{errors.textFeedback.message}</p>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-white"
                        >
                            {isSubmitting ? "Updating..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FeedbackEditDialog