function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-[#fdf9f3] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-lg bg-white border border-[#e6d9c8] p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-serif font-bold text-[#2f241c]">
          Profile Details
        </h1>

        {user ? (
          <div className="space-y-2 text-[#3b2f2f]">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p className="mt-6 text-sm text-[#6b4f3f] italic">
              Profile editing will be available soon.
            </p>
          </div>
        ) : (
          <p className="text-[#8b3a3a]">You are not logged in.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
