import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import API from "../../services/api";

function ManageAcademics() {

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);

  /* 📚 LOAD CLASSES */
  const fetchClasses = async () => {
    try {

      const res = await API.get("/classes");

      const list = res.data?.data || res.data || [];

      setClasses(list);

      if (list.length) {
        setSelectedClass(list[0]._id);
      }

    } catch (error) {

      console.error("Class fetch error:", error);

    }
  };


  /* 📚 LOAD SUBJECTS */
  const fetchSubjects = async (classId) => {

    if (!classId) return;

    try {

      const res = await API.get(`/subjects?classId=${classId}`);

      const list = res.data?.data || res.data || [];

      setSubjects(list);

    } catch (error) {

      console.error("Subject fetch error:", error);

    }

  };


  useEffect(() => {
    fetchClasses();
  }, []);


  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass);
    }
  }, [selectedClass]);


  /* ➕ ADD SUBJECT */
  const addSubject = async () => {

    const name = prompt("Enter subject name");

    if (!name) return;

    try {

      await API.post("/subjects", {
        name,
        classId: selectedClass
      });

      fetchSubjects(selectedClass);

    } catch (error) {

      console.error("Add subject error:", error);

    }

  };


  /* ❌ DELETE SUBJECT */
  const deleteSubject = async (id) => {

    try {

      await API.delete(`/subjects/${id}`);

      fetchSubjects(selectedClass);

    } catch (error) {

      console.error("Delete subject error:", error);

    }

  };


  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Manage Subjects
      </h1>


      {/* SELECT CLASS */}
      <div className="mb-6">

        <label className="block mb-2 font-semibold">
          Select Class
        </label>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border p-3 rounded-lg"
        >

          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}

        </select>

      </div>


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