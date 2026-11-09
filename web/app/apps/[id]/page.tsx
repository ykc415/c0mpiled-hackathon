import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetail } from "@/components/pages";
import { translate } from "@/lib/i18n";
import { getProduct, PRODUCTS } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<"/apps/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const app = getProduct(id);
  return app ? { title: `${app.name} — Appetizer`, description: translate("en", app.description) } : {};
}

// The URL is read inside Suspense so the route's shared App Shell stays URL-independent
// and navigation can be instant.
export default function AppPage(props: PageProps<"/apps/[id]">) {
  return (
    <Suspense fallback={null}>
      <AppDetail params={props.params} />
    </Suspense>
  );
}

async function AppDetail({ params }: { params: PageProps<"/apps/[id]">["params"] }) {
  const { id } = await params;
  if (!getProduct(id)) notFound();
  return <ProductDetail id={id} />;
}
