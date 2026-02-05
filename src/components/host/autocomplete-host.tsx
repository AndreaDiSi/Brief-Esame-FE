import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useHost } from "../context/host-context"
import type { THost } from "../context/host-context"

interface HostAutocompleteProps {
  onSelect: (host: THost) => void
}

const HostAutocomplete = ({ onSelect }: HostAutocompleteProps) => {
  const { data } = useHost()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const filtered = data.filter((host) =>
    `${host.hostName} ${host.surname} ${host.idHost}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <div className="relative w-full">
      <Input
        placeholder="Search host by name or ID..."
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
            filtered.map((host) => (
              <div
                key={host.idHost}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  onSelect(host)
                  setQuery(`${host.hostName} ${host.surname}`)
                  setOpen(false)
                }}
              >
                {host.hostName} {host.surname} — ID: {host.idHost}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No hosts found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HostAutocomplete
