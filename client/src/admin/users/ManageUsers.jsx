import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { User, ShieldOff, ShieldCheck } from "lucide-react";

function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  /* 📦 FETCH USERS */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/users?page=1&limit=50");

      const data = res.data?.data || [];

      setUsers(data);

    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* 🚫 BLOCK / UNBLOCK */
  const toggleBlock = async (userId, isBlocked) => {

    try {

      setActionLoading(userId);

      const endpoint = isBlocked
        ? `/admin/users/${userId}/unblock`
        : `/admin/users/${userId}/block`;

      await API.put(endpoint);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, isBlocked: !isBlocked }
            : u
        )
      );

    } catch (err) {

      console.error(err);
      alert("Action failed");

    } finally {
      setActionLoading(null);
    }

  };

  /* ⏳ LOADING */
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading users...
      </div>
    );
  }

  return (

    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Manage Users
        </h1>

        <button
          onClick={fetchUsers}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Refresh
        </button>

      </div>

      {/* ❌ ERROR */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {users.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-5 bg-gray-100 p-4 text-sm font-semibold">
            <span>Name</span>
            <span>Contact</span>
            <span>Provider</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {/* USERS */}
          {users.map((user) => (

            <div
              key={user._id}
              className="grid md:grid-cols-5 gap-3 items-center p-4 border-t text-sm hover:bg-gray-50 transition"
            >

              {/* NAME */}
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-600" />
                {user.name || "No Name"}
              </div>

              {/* CONTACT */}
              <div className="text-gray-600 break-all">
                {user.email || user.phone || "N/A"}
              </div>

              {/* PROVIDER */}
              <div>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                  {user.authProvider || "phone"}
                </span>
              </div>

              {/* STATUS */}
              <div>
                {user.isBlocked ? (
                  <span className="text-red-500 font-medium">
                    Blocked
                  </span>
                ) : (
                  <span className="text-green-600 font-medium">
                    Active
                  </span>
                )}
              </div>

              {/* ACTION */}
              <div>
                <button
                  disabled={actionLoading === user._id}
                  onClick={() =>
                    toggleBlock(user._id, user.isBlocked)
                  }
                  className={`
                    flex items-center gap-1 px-3 py-1 rounded text-xs font-medium
                    ${
                      user.isBlocked
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }
                    ${
                      actionLoading === user._id
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }
                  `}
                >
                  {actionLoading === user._id ? (
                    "Processing..."
                  ) : user.isBlocked ? (
                    <>
                      <ShieldCheck size={14} /> Unblock
                    </>
                  ) : (
                    <>
                      <ShieldOff size={14} /> Block
                    </>
                  )}
                </button>
              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default React.memo(ManageUsers);