import OrtaqClient from "@/components/ortaq/OrtaqClient";

export const metadata = {
  title: "Ortaq | Bacar.az",
  description: "Layihən üçün komanda üzvləri və ortaq tap.",
  alternates: { canonical: "/ortaq" },
};

export default function OrtaqPage() {
  return <OrtaqClient />;
}