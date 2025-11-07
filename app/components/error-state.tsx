export function ErrorState() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
      <p className="text-red-800 text-sm">
        Failed to load country data. Please try again or select a different country.
      </p>
    </div>
  );
}
