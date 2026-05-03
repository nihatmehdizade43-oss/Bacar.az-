import LayiheClient from "./LayiheClient";

export const metadata = {
  title: "Layihə | Bacar.az",
  description: "Startup ideyalarını vitrində paylaş və investor tap.",
  alternates: { canonical: "/layihe" },
};

export default function LayihePage() {
  return <LayiheClient />;
}
