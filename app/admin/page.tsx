const AdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Indicators */}
        <div className="bg-white shadow rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">System Status</h2>
          <p>
            Service A: <span className="text-emerald-500">Active</span>
          </p>
          <p>
            Service B: <span className="text-red-500">Inactive</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white shadow rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Actions</h2>
          <button className="gradient-primary text-white font-bold py-2 px-4 rounded mr-2">Deploy Update</button>
          <button className="gradient-secondary text-white font-bold py-2 px-4 rounded">Restart Server</button>
        </div>

        {/* Charts and Graphs */}
        <div className="bg-white shadow rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Performance Metrics</h2>
          {/* Placeholder for chart/graph */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-500 via-fuchsia-500 rounded-md">
            {/* Replace with actual chart component */}
          </div>
        </div>

        {/* Warning Alerts */}
        <div className="bg-white shadow rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Alerts</h2>
          <div className="text-orange-500 bg-orange-100 p-2 rounded-md">Warning: High CPU usage detected.</div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
