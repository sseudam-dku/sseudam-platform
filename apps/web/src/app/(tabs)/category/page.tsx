import { Suspense } from "react";

import CategoryClient from "@/components/category/category-client";

export default function CategoryPage() {
  return (
    <Suspense>
      <CategoryClient />
    </Suspense>
  );
}
