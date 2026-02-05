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
import { Textarea } from "@/components/ui/textarea" // Assumendo tu abbia un componente Textarea
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFeedback, type TNewFeedback } from "../context/feedback-context"
import { useReservation } from "../context/reservation-context"
import { toast } from "sonner"
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
        const payload: TNewFeedback = {
            title: formData.title,
            textFeedback: formData.textFeedback,
            points: formData.points,
            idReservation: formData.idReservation,
        }

        await addFeedback(payload);

        toast.success("Feedback submitted", {
            description: "Thank you! Your feedback has been recorded.",
        })

        reset();
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

                            <Field className="col-span-2">
                                <Label>Reservation</Label>
                                <input
                                    type="text"
                                    placeholder="Search by name or ID"
                                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <select
                                    {...register("idReservation", { valueAsNumber: true })}
                                    className="border border-black"
                                >
                                    <option value="">-- Select a Reservation --</option>
                                    {filteredDataReservation.map(reservation => (
                                        <option key={reservation.idReservation} value={reservation.idReservation}>
                                            (ID: {reservation.idReservation})
                                        </option>
                                    ))}
                                </select>
                                {errors.idReservation && <p className="text-red-500 text-sm">{errors.idReservation.message}</p>}
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
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
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