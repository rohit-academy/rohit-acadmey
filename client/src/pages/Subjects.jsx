import React from "react";
import { useParams } from "react-router-dom";
import SubjectCard from "../components/cards/SubjectCard";

function Subjects() {
  const { classId, streamId } = useParams();

  const comingSoonCourses = ["ba", "bsc", "bcom"];

  const subjectData = {
    "9": ["Hindi","English","Science","Social Science","Mathematics","Sanskrit","Home Science"],
    "10": ["Hindi","English","Science","Social Science","Mathematics","Sanskrit","Home Science"],

    "11": {
      pcb: ["General Hindi","English","Physics","Chemistry","Biology"],
      pcm: ["General Hindi","English","Physics","Chemistry","Mathematics"],
      arts: [
        "General Hindi","English","History","Geography","Political Science",
        "Economics","Sociology","Civics","Education","Sanskrit","Home Science"
      ]
    },

    "12": {
      pcb: ["General Hindi","English","Physics","Chemistry","Biology"],
      pcm: ["General Hindi","English","Physics","Chemistry","Mathematics"],
      arts: [
        "General Hindi","English","History","Geography","Political Science",
        "Economics","Sociology","Civics","Education","Sanskrit","Home Science"
      ]
    }
  };

  // 🚧 College Coming Soon
  if (comingSoonCourses.includes(classId)) {
    return (
      <div className="text-center py-24 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 uppercase">
          {classId} Study Materials
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Important Questions & Answers for all semesters will be available soon.
        </p>

        <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full inline-block font-semibold shadow">
          🚧 Coming Soon
        </div>
      </div>
    );
  }

  let subjects = [];

  if (streamId && subjectData[classId]?.[streamId]) {
    subjects = subjectData[classId][streamId];
  } else if (!streamId && Array.isArray(subjectData[classId])) {
    subjects = subjectData[classId];
  }

  // ❗ Safety
  if (subjects.length === 0) {
    return (
      <div className="text-center py-24">
        <h1 className="text-3xl font-bold mb-4">Subjects Not Available</h1>
        <p className="text-gray-600">Content for this category is under preparation.</p>
      </div>
    );
  }

  const streamNameMap = {
    pcb: "PCB (Biology)",
    pcm: "PCM (Maths)",
    arts: "Arts Stream"
  };

  const streamBadgeStyle = {
    pcb: "bg-green-100 text-green-700",
    pcm: "bg-blue-100 text-blue-700",
    arts: "bg-pink-100 text-pink-700"
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Class {classId} Subjects
        </h1>

        {streamId && (
          <span className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${streamBadgeStyle[streamId]}`}>
            {streamNameMap[streamId]}
          </span>
        )}
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <SubjectCard key={subject} subject={subject} streamId={streamId} />
        ))}
      </div>
    </div>
  );
}

export default Subjects;
