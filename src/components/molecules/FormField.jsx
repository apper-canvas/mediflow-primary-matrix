import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  options, 
  placeholder, 
  required = false,
  error,
  className = ""
}) => {
const handleChange = (valueOrEvent) => {
    if (onChange) {
      // Handle direct value (from Select component) or event object (from standard inputs)
      const value = valueOrEvent?.target?.value !== undefined 
        ? valueOrEvent.target.value 
        : valueOrEvent;
      onChange(value);
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === "select" ? (
        <Select value={value} onChange={handleChange}>
          <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
        />
      ) : type === "date" ? (
        <input
          type="date"
          value={value}
          onChange={handleChange}
          required={required}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
        />
      ) : type === "number" ? (
        <input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          min="0"
          step="0.01"
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormField