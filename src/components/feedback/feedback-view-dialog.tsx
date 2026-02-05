import type { TFeedback } from "../context/feedback-context";
import { useReservation } from "../context/reservation-context";

interface Props {
    feedback: TFeedback;
    open: boolean;
    onClose: () => void;
}

const FeedbackViewDialog = ({ feedback, open, onClose }: Props) => {
    const { reservations } = useReservation();

    if (!open) return null;

    // Helper per trovare i dettagli della prenotazione
    const reservation = reservations.find(r => r.idReservation === feedback.idReservation);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black opacity-40"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Feedback Details
                    </h3>
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                        {feedback.points} / 5 Rating
                    </span>
                </div>

                <div className="space-y-4 text-sm text-gray-700">
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md">
                        <p><b>Feedback ID:</b> {feedback.idFeed}</p>
                        <p><b>Reservation ID:</b> {feedback.idReservation}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Title</p>
                        <p className="text-base font-medium">{feedback.title}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Review Content</p>
                        <p className="bg-gray-50 p-3 rounded border border-gray-100 italic">
                            "{feedback.textFeedback}"
                        </p>
                    </div>

                    {reservation && (
                        <div className="border-t pt-3 mt-2">
                            <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Connected Reservation</p>
                            <p>Period: <span className="font-medium">{reservation.reservationStartDate}</span> to <span className="font-medium">{reservation.reservationEndDate}</span></p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackViewDialog;