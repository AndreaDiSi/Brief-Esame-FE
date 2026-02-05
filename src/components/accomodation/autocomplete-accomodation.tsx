import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useAccomodation, type TAccomodation } from "../context/accomodation-context"

interface AccomodationAutocompleteProps {
 
  onSelect: (accomodation: TAccomodation) => void
  placeholder?: string
}

const AccomodationAutocomplete = ({
  onSelect,
  placeholder = "Search accomodation...",
  
}: AccomodationAutocompleteProps) => {
    const {accomodationData}  = useAccomodation();
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const filtered = accomodationData.filter((a) =>
    `${a.accomodationName} ${a.accomodationAddress}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <div className="relative w-full">
      <Input
        placeholder={placeholder}
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
            filtered.map((a) => (
              <div
                key={a.idAccomodation}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  onSelect(a)
                  setQuery(`${a.accomodationName} — ${a.accomodationAddress}`)
                  setOpen(false)
                }}
              >
                {a.accomodationName} — {a.accomodationAddress} (ID: {a.idAccomodation})
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">No accomodations found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default AccomodationAutocomplete
