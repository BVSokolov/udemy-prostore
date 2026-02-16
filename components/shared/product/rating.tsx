import { StarHalfIcon, StarIcon } from "lucide-react"

const MAX_RATING = 5

const Rating = ({ value, caption }: { value: number; caption?: string }) => {
  return (
    <div className="flex gap-2">
      <div className="flex gap-1">
        {Array.from({ length: MAX_RATING }).map((_value, index) => {
          const diff = value - index - 1
          return diff >= 0 ? (
            diff === 0 || diff > 0.5 ? (
              <StarIcon
                key={index}
                className="w-5 h-5 text-amber-600 fill-current"
              />
            ) : (
              <StarHalfIcon
                key={index}
                className="w-5 h-5 text-amber-600 fill-current"
              />
            )
          ) : (
            <StarIcon key={index} className="w-5 h-5 text-muted" />
          )
        })}

        {caption && <span className="text-sm">{caption}</span>}
      </div>
    </div>
  )
}

export default Rating
