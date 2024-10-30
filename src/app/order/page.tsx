export default function Order() {
  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4 text-center">Place Your Order</h1>
      <form className="max-w-lg mx-auto mt-6 bg-gray-100 p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Service</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option>Essay Writing</option>
            <option>Research Paper</option>
            <option>Dissertation</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Details</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={4}
            placeholder="Describe your requirements..."
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
}
