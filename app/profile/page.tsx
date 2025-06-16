const ProfilePage = () => {
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover border-4 border-indigo-500"
          />
          <div className="absolute bottom-0 right-0">
            <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-7.939 7.939c-.621.621-1.075 1.475-1.356 2.469l-1.745-.372c-.434-.093-.888.072-1.145.329-.257.257-.422.711-.329 1.145l.372 1.745c.994-.281 1.848-.735 2.469-1.356l7.939-7.939a2 2 0 012.828-2.828z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-4">User Name</h1>
      <p className="text-gray-600 text-center mb-8">user@example.com</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-lg shadow-md gradient-primary">
          <h2 className="text-lg font-semibold mb-2">Posts</h2>
          <p className="text-gray-700">120</p>
        </div>
        <div className="p-4 rounded-lg shadow-md gradient-secondary">
          <h2 className="text-lg font-semibold mb-2">Followers</h2>
          <p className="text-gray-700">345</p>
        </div>
        <div className="p-4 rounded-lg shadow-md gradient-accent">
          <h2 className="text-lg font-semibold mb-2">Following</h2>
          <p className="text-gray-700">210</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <div className="flex space-x-4">
          <div className="text-fuchsia-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.95l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-violet-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L13.657 10l1.172 1.171a4 4 0 01-5.656 5.656L10 13.657l-1.172 1.171a4 4 0 11-5.656-5.656L6.343 10 5.172 8.829a4 4 0 010-5.657z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3H7a5 5 0 015 5v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9 4a3 3 0 00-3-3v1a1 1 0 11-2 0V6a3 3 0 00-3 3h1a5 5 0 015-5h2a2 2 0 012 2v4a2 2 0 01-2 2H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Progress</h2>
        <div className="mb-2">
          <div className="flex justify-between">
            <span>Task 1</span>
            <span>50%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "50%" }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <span>Task 2</span>
            <span>75%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-violet-500 h-2 rounded-full" style={{ width: "75%" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
