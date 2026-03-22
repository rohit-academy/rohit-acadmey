import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { User, ShieldOff, ShieldCheck } from "lucide-react";

function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     📦 FETCH USERS
  ============================== */
  useEffect(() => {

    const fetchUsers = async () => {
      try {

        const res = await API.get("/admin/users");

        const data =
          res.data?.data ||
          res.data ||
          [];

        setUsers(data);

      } catch (error) {
        console.error("Users fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

  }, []);

  /* ===============================
     🚫 BLOCK / UNBLOCK
  ============================== */
  const toggleBlock = async (userId, isBlocked) => {

    try {

      await API.put(`/admin/users/${userId}/block`, {
        isBlocked: !isBlocked
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBlocked: !isBlocked } : u
        )
      );

    } catch (error) {
      console.error("Block error:", error);
      alert("Action failed");
    }

  };

  /* ===============================
     ⏳ LOADING
  ============================== */
  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (

    <div>

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Manage Users
      </h1>

      {/* EMPTY */}
      {users.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {/* TABLE HEADER */}
          <div className="grid grid-cols-5 bg-gray-100 p-4 text-sm font-semibold">
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
              className="grid grid-cols-5 items-center p-4 border-t text-sm hover:bg-gray-50 transition"
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
                  {user.authProvider}
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
                  onClick={() =>
                    toggleBlock(user._id, user.isBlocked)
                  }
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium ${
                    user.isBlocked
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                >
                  {user.isBlocked ? (
                    <>
                      <ShieldCheck size={14} />
                      Unblock
                    </>
                  ) : (
                    <>
                      <ShieldOff size={14} />
                      Block
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

export default ManageUsers;