import Link from "next/link"
import { Button } from "../ui/button"

const AdminPageTitle = ({
  searchText,
  title,
  href,
}: {
  searchText: string
  title: string
  href: string
}) => {
  return (
    <div className="flex items-center gap-3">
      <h1 className="h2-bold capitalize">{title}</h1>
      {searchText && (
        <div className="self-end ml-2 flex gap-2 items-center">
          Filtered by <i>&quot;{searchText}&quot;</i>
          <Link href={href}>
            <Button variant="outline" size="sm">
              Remove Filter
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default AdminPageTitle
