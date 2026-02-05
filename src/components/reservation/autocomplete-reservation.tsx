import { useState } from "react"
import { useReservation, type TReservation } from "../context/reservation-context"
import { Input } from "@/components/ui/input"

interface ReservationAutocompleteProps {
  onSelect: (reservation: TReservation) => void
}

export const ReservationAutocomplete = ({ onSelect }: ReservationAutocompleteProps) => {
  const { reservations } = useReservation()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const filtered = reservations.filter((res) =>
    `${res.idReservation} ${res.idTenant} ${res.idAccomodation}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <div className="relative w-full">
      <Input
        placeholder="Search reservation by ID, tenant or accomodation..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && query && (
        <div className="absolute z-50 w-full bg-white border rounded-md shadow-md max-h-48 overflow-y-auto mt-1">
          {filtered.length > 0 ? (
            filtered.map((res) => (
              <div
                key={res.idReservation}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  onSelect(res)
                  setQuery(`Reservation #${res.idReservation}`)
                  setOpen(false)
                }}
              >
                Reservation #{res.idReservation} — Tenant ID: {res.idTenant}, Accomodation ID: {res.idAccomodation}
                <br />
                {res.reservationStartDate} → {res.reservationEndDate}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No reservations found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ReservationAutocomplete
