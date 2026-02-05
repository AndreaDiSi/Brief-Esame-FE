import { useState } from "react"
import { useTenant,type TTenant } from "../context/tenant-context"
import { Input } from "@/components/ui/input"

interface TenantAutocompleteProps {
  onSelect: (tenant: TTenant) => void
  placeholder?: string
}

const TenantAutocomplete = ({ onSelect, placeholder = "Search tenant..." }: TenantAutocompleteProps) => {
  const { tenantData } = useTenant()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const filtered = tenantData.filter((tenant) =>
    `${tenant.tenantName} ${tenant.surname} ${tenant.idTenant}`
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
            filtered.map((tenant) => (
              <div
                key={tenant.idTenant}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  onSelect(tenant)
                  setQuery(`${tenant.tenantName} ${tenant.surname}`)
                  setOpen(false)
                }}
              >
                {tenant.tenantName} {tenant.surname} — ID: {tenant.idTenant}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No tenants found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TenantAutocomplete
