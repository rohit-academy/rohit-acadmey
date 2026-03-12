import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubjectCard from "../components/cards/SubjectCard";
import SubjectsSkeleton from "../components/loaders/SubjectsSkeleton";
import API from "../services/api";

function Subjects() {

  const { classId, streamId } = useParams();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const comingSoonCourses = ["ba", "bsc", "bcom"];

  /* 🚧 Coming Soon Courses */
  if (comingSoonCourses.includes(classId)) {
    return (
      <div className="text-center py-24 max-w-3xl mx-auto px-4">

        <h1 className="text-4xl font-bold mb-4 uppercase">
          {classId} Study Materials
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Important Questions & Answers for all semesters will be available soon.
        </p>

        <div className="inline-block bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-semibold shadow-sm">
          🚧 Coming Soon
        </div>

      </div>
    );
  }

  /* 📦 LOAD SUBJECTS */
  useEffect(() => {

    const fetchSubjects = async () => {

      try {

        setLoading(true);

        let url = `/subjects?classId=${classId}`;

        if (streamId) {
          url += `&stream=${streamId.toUpperCase()}`;
        }

        const res = await API.get(url);

        const subjectList = res.data?.data || [];

        setSubjects(subjectList);

      } catch (error) {

        console.error("Subjects fetch error:", error);

        setSubjects([]);

      } finally {

        setLoading(false);

      }

    };

    if (classId) {
      fetchSubjects();
    }

  }, [classId, streamId]);


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


  /* ⏳ Skeleton Loader */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <SubjectsSkeleton />
      </div>
    );
  }

  /* ❌ No Subjects */
  if (!subjects.length) {
    return (
      <div className="text-center py-24 px-4">

        <h1 className="text-3xl font-bold mb-3">
          Subjects Not Available
        </h1>

        <p className="text-gray-600">
          Content for this class is currently under preparation.
        </p>

      </div>
    );
  }


  return (

    <div className="max-w-6xl mx-auto px-4">

      {/* HEADER */}
      <div className="text-center mb-10">

        <h1 className="text-3xl md:text-4xl font-bold">
          Subjects
        </h1>

        {streamId && (
          <span
            className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${streamBadgeStyle[streamId]}`}
          >
            {streamNameMap[streamId]}
          </span>
        )}

      </div>


      {/* SUBJECT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-fadeIn">

        {subjects.map((subject) => (

          <SubjectCard
            key={subject._id}
            subject={subject}
            streamId={streamId}
          />

        ))}

      </div>

    </div>

  );

}

export default Subjects;