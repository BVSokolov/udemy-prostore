import ProductCard from "@/components/shared/product/product-card"
import { Button } from "@/components/ui/button"
import { getAllCategories, getAllProducts } from "@/lib/actions/product.actions"
import { StarIcon } from "lucide-react"
import Link from "next/link"

const prices = () => {
  const ranges = [
    [1, 50],
    [51, 100],
    [101, 200],
    [201, 500],
    [501, 1000],
  ]

  return ranges.map((priceRange) => ({
    name: `$${priceRange[0]} to $${priceRange[1]}`,
    value: `${priceRange[0]}-${priceRange[1]}`,
  }))
}
const PRICE_RANGES = prices()

const RATINGS = [4, 3, 2, 1]

const SORT_ORDERS = ["newest", "lowest", "highest", "rating"]

type SearchParams = {
  q?: string
  category?: string
  price?: string
  rating?: string
  sort?: string
  page?: string
}

export async function generateMetadata(props: {
  searchParams: Promise<Omit<SearchParams, "sort" | "page">>
}) {
  const searchParams = await props.searchParams
  const titleFilters = Object.entries(searchParams)
    .filter(([_key, value]) => value.trim())
    .map(([key, value]) => `${key !== "q" ? key : ""} ${value}`)
    .join(" | ")

  return {
    title: `Search ${titleFilters}`,
  }
}

const SearchPage = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = searchParams

  // Construct filter url
  const getFilterUrl = (props: {
    category?: string
    sort?: string
    price?: string
    rating?: string
    page?: string
  }) => {
    const urlParams: typeof props = Object({ ...searchParams })
    Object.entries(props).forEach(([key, value]) => {
      // @ts-expect-error too lazy to type it correctly
      urlParams[key] = value
    })

    return `/search?${new URLSearchParams(urlParams).toString()}`
  }

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  })

  const categories = await getAllCategories()

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links flex flex-col gap-6">
        {/* Category Links */}
        <div>
          <div className="text-xl mb-2">Category</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(category === "all" || category === "") && "font-bold"}`}
                href={getFilterUrl({ category })}
              >
                Any
              </Link>
            </li>
            {categories.map(({ category: categoryName }) => (
              <li key={categoryName}>
                <Link
                  className={`${category === categoryName && "font-bold"}`}
                  href={getFilterUrl({ category: categoryName })}
                >
                  {categoryName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Links */}
        <div>
          <div className="text-xl mb-2">Price</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === "all" && "font-bold"}`}
                href={getFilterUrl({ price: "all" })}
              >
                Any
              </Link>
            </li>
            {PRICE_RANGES.map(({ name, value }) => (
              <li key={value}>
                <Link
                  className={`${price === value && "font-bold"}`}
                  href={getFilterUrl({ price: value })}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ratings Links */}
        <div>
          <div className="text-xl mb-2">Customer Rating</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === "all" && "font-bold"}`}
                href={getFilterUrl({ rating: "all" })}
              >
                Any
              </Link>
            </li>
            {RATINGS.map((filterRating) => (
              <li key={filterRating}>
                <Link
                  className={`${price === filterRating.toString() && "font-bold"} space-x-1`}
                  href={getFilterUrl({ rating: filterRating.toString() })}
                >
                  {Array.from({ length: filterRating }).map((_, starIndex) => (
                    <StarIcon
                      key={starIndex}
                      className="inline h-4 w-4 text-amber-600 fill-current"
                    />
                  ))}
                  &nbsp;+
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "all" && q !== "" && `Query: ${q}`}
            {category !== "all" && category !== "" && ` Category: ${category}`}
            {price !== "all" && price !== "" && ` Price: ${price}`}
            {rating !== "all" &&
              rating !== "" &&
              ` Rating: ${rating} stars & up`}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant="link" asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            {/* SORT */}
            <strong>Sort by </strong>
            {SORT_ORDERS.map((sortFilter) => (
              <Link
                key={sortFilter}
                className={`mx-2 ${sort === sortFilter && "font-bold"} `}
                href={getFilterUrl({ sort: sortFilter })}
              >
                {sortFilter}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
