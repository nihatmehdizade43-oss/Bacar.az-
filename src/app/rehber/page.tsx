import RehberClient from "@/components/rehber/RehberClient";

export const metadata = {
  title: "Rəhbər | Bacar.az",
  description: "Mentorlarla seans sifariş et və inkişaf et.",
  alternates: { canonical: "/rehber" },
};

export default function RehberPage() {
  return <RehberClient />;
}
