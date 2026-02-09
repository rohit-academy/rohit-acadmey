import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

function ManageAcademics() {
  const [classes, setClasses] = useState(["9", "10", "11", "12"]);
  const [streams, setStreams] = useState(["PCB", "PCM", "Arts"]);
  const [subjects, setSubjects] = useState(["Physics", "Chemistry", "Biology"]);

  const addItem = (listSetter, list) => {
    const value = prompt("Enter name");
    if (value) listSetter([...list, value]);
  };

  const removeItem = (listSetter, list, index) => {
    const updated = [...list];
    updated.splice(index, 1);
    listSetter(updated);
  };

  const Section = ({ title, list, setList }) => (
    <div className="bg-white p-5 rounded-xl shadow">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold text-lg">{title}</h2>
        <button
          onClick={() => addItem(setList, list)}
          className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <ul className="space-y-2">
        {list.map((item, i) => (
          <li key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded">
            {item}
            <button onClick={() => removeItem(setList, list, i)} className="text-red-500">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Academics</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Section title="Classes" list={classes} setList={setClasses} />
        <Section title="Streams" list={streams} setList={setStreams} />
        <Section title="Subjects" list={subjects} setList={setSubjects} />
      </div>
    </div>
  );
}

export default ManageAcademics;
