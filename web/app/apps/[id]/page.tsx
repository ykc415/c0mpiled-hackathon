import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/pages";
import { getProduct, PRODUCTS } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<"/apps/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const app = getProduct(id);
  return app ? { title: `${app.name} — Indie Shorts`, description: app.description } : {};
}

export default async function AppPage(props: PageProps<"/apps/[id]">) {
  const { id } = await props.params;
  if (!getProduct(id)) notFound();
  return <ProductDetail id={id} />;
}
