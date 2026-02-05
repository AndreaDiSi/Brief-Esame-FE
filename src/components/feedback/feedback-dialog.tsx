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
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFeedback, type TNewFeedback } from "../context/feedback-context"
import { useReservation } from "../context/reservation-context"
import { ReservationAutocomplete } from "../reservation/autocomplete-reservation"
import { feedbackSchema } from "./feedback-edit-dialog"
import { useState } from "react"



type FeedbackFormData = z.infer<typeof feedbackSchema>;

function FeedbackDialog() {
    const { addFeedback } = useFeedback();
    const { reservations } = useReservation();
    const [searchTerm, setSearchTerm] = useState('');


    const form = useForm<FeedbackFormData>({
        resolver: zodResolver(feedbackSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            textFeedback: "",
            points: 5,
            idReservation: 0,
        }
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = form

    const onSubmit = async (formData: FeedbackFormData) => {
        try {
            const payload: TNewFeedback = {
                title: formData.title,
                textFeedback: formData.textFeedback,
                points: formData.points,
                idReservation: formData.idReservation,
            }

            await addFeedback(payload);
            reset();

        } catch (error) {
            console.error("Error adding feedback:", error);
        }
    }

    const filteredDataReservation = reservations.filter(item => {

        if (searchTerm === '') {
            return null;
        }

        const idReservationtoString = item.idReservation.toString();
        return (
            item.reservationEndDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.reservationStartDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            idReservationtoString.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <Dialog>
            <DialogTrigger render={
                <Button className="bg-primary">
                    <Plus /> New Feedback
                </Button>}>
            </DialogTrigger>

            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Leave a Feedback</DialogTitle>
                        <DialogDescription className="mb-2">
                            Share your experience regarding a specific reservation.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="flex flex-col gap-4">
                        <Field>
                            <Label>Title</Label>
                            <Input {...register("title")} placeholder="Great stay!" />
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

                            <Field>
                                <Label>Reservation ID</Label>
                                <ReservationAutocomplete
                                    onSelect={(reservation) => {

                                        form.setValue("idReservation", reservation.idReservation)
                                    }}

                                />
                                <input type="hidden" {...register("idReservation", { valueAsNumber: true })} />

                                {errors.idReservation && <p className="text-red-500">{errors.idReservation.message}</p>}


                            </Field>
                        </div>

                        <Field>
                            <Label>Your Review</Label>
                            <Textarea
                                {...register("textFeedback")}
                                placeholder="Describe your experience..."
                                className="min-h-[100px]"
                            />
                            {errors.textFeedback && (
                                <p className="text-red-500 text-sm">{errors.textFeedback.message}</p>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FeedbackDialog;