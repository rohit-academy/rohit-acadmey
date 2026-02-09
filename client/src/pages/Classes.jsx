import React from "react";
import ClassCard from "../components/cards/ClassCard";

const classes = [
  { id: "9", name: "Class 9" },
  { id: "10", name: "Class 10" },
  { id: "11", name: "Class 11" },
  { id: "12", name: "Class 12" },
  { id: "ba", name: "BA" },
  { id: "bsc", name: "BSc" },
  { id: "bcom", name: "BCom" }
];

function Classes() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        Choose Your Class
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {classes.map((cls) => {
          let route = "";

          // 🎓 Class 11 & 12 → Streams page
          if (cls.id === "11" || cls.id === "12") {
            route = `/streams/${cls.id}`;
          }
          // 🎓 BA / BSc / BCom → Coming Soon subjects page
          else if (["ba", "bsc", "bcom"].includes(cls.id)) {
            route = `/subjects/${cls.id}`;
          }
          // 📘 Class 9 & 10 → Direct subjects
          else {
            route = `/subjects/${cls.id}`;
          }

          return (
            <ClassCard
              key={cls.id}
              id={cls.id}
              name={cls.name}
              route={route}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Classes;
