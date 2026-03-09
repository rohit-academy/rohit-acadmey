import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import API from "../../services/api";

function ManageAcademics() {

  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {

      const res = await API.get("/subjects");

      const list = res.data?.data || res.data || [];

      setSubjects(list);

    } catch (error) {

      console.error("Subject fetch error:", error);

    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);


  const addSubject = async () => {

    const name = prompt("Enter subject name");

    if (!name) return;

    try {

      await API.post("/subjects", {
        name,
        classId: null
      });

      fetchSubjects();

    } catch (error) {

      console.error("Add subject error:", error);

    }

  };


  const deleteSubject = async (id) => {

    try {

      await API.delete(`/subjects/${id}`);

      fetchSubjects();

    } catch (error) {

      console.error("Delete subject error:", error);

    }

  };


  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Manage Subjects
      </h1>

      <div className="bg-white p-5 rounded-xl shadow">

        <div className="flex justify-between mb-4">

          <h2 className="font-bold text-lg">
            Subjects
          </h2>

          <button
            onClick={addSubject}
            className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>

        </div>

        <ul className="space-y-2">

          {subjects.map((sub) => (

            <li
              key={sub._id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded"
            >

              {sub.name}

              <button
                onClick={() => deleteSubject(sub._id)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>

            </li>

          ))}

        </ul>

      </div>

    </div>

  );

}

export default ManageAcademics;