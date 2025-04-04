export default function RacesPage() {
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Races</h1>
      </div>

      <section className="bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
            Race Information
          </h2>
          <p className="text-center text-gray-400">
            Select a race meeting from the Live Racing page to view race details.
          </p>
        </div>
      </section>
    </main>
  )
}