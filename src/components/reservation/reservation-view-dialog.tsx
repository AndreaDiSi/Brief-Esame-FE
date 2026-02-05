import type { TReservation } from "../context/reservation-context";

interface Props {
    reservation: TReservation;
    open: boolean;
    onClose: () => void;
}

const ReservationViewDialog = ({ reservation, open, onClose }: Props) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <h3 className="text-xl font-semibold mb-4">Reservation Details</h3>
                <div className="space-y-2 text-sm text-gray-700">
                    <p><b>ID:</b> {reservation.idReservation}</p>
                    <p><b>Tenant ID:</b> {reservation.idTenant}</p>
                    <p><b>Accomodation ID:</b> {reservation.idAccomodation}</p>
                    <p><b>Start Date:</b> {reservation.reservationStartDate}</p>
                    <p><b>End Date:</b> {reservation.reservationEndDate}</p>
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-lg ">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationViewDialog;