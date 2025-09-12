export default function DashboardPage() {
  return (
    // Main container with background similar to home page
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-indigo-50 overflow-hidden">
      {/* Optional background image or color overlay for consistency */}
      <div className="absolute inset-0 w-full h-full -z-10">
        {/* You can add a background image here if desired, similar to the home page */}
      </div>
      {/* Profile card */}
      <div className="relative w-full max-w-md bg-white rounded-lg shadow p-10 flex flex-col items-center">
        {/* Profile picture (placeholder) */}
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-indigo-200 shadow mb-6 object-cover"
        />
        {/* User information */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">John Doe</h2>
        <h3 className="text-lg text-indigo-600 mb-2">Full Stack Developer</h3>
        <p className="text-center text-gray-700 mb-4">
          Passionate about building modern web applications with great user
          experiences. Always learning and exploring new technologies.
        </p>
        {/* You can add more profile details or actions here */}
      </div>
    </main>
  );
}
