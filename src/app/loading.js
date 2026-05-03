/* Purpose: Global loading UI */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-brand-blue/20 border-t-brand-blue animate-spin" />
    </div>
  );
}
