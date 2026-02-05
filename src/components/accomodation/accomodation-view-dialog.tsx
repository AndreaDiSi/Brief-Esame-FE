import type { TAccomodation } from "../context/accomodation-context";

interface Props {
    accomodation: TAccomodation;
    open: boolean;
    onClose: () => void;
}

const AccomodationViewDialog = ({ accomodation, open, onClose }: Props) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="absolute inset-0 bg-black opacity-40"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <h3 className="text-xl font-semibold mb-4">
                    Accomodation Details
                </h3>

                <div className="space-y-2 text-sm text-gray-700">
                    <p><b>ID:</b> {accomodation.idAccomodation}</p>
                    <p><b>Name:</b> {accomodation.accomodationName}</p>
                    <p><b>Address:</b> {accomodation.accomodationAddress}</p>
                    <p><b>Rooms:</b> {accomodation.nrooms}</p>
                    <p><b>Bed places:</b> {accomodation.nbedPlaces}</p>
                    <p><b>Floor:</b> {accomodation.floor}</p>
                    <p><b>Price:</b> €{accomodation.price}</p>
                    <p><b>Start date:</b> {accomodation.startDate}</p>
                    <p><b>End date:</b> {accomodation.endDate}</p>
                    <p><b>Host ID:</b> {accomodation.hostId}</p>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-white rounded-lg "
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccomodationViewDialog;
