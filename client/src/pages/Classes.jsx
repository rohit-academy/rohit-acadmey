import React, { useEffect, useState } from "react";
import ClassCard from "../components/cards/ClassCard";
import API from "../services/api";
import Loader from "../components/ui/Loader";

function Classes() {

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchClasses = async () => {

      try {

        const res = await API.get("/classes");

        const list =
          res.data?.data ||
          res.data ||
          [];

        setClasses(list);

      } catch (error) {

        console.error("Classes fetch error:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchClasses();

  }, []);

  if (loading) return <Loader />;

  return (

    <div>

      <h1 className="text-3xl font-bold text-center mb-8">
        Choose Your Class
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {classes.map((cls) => {

          let route = "";

          const className = cls.name.replace("Class ", "");

          if (className === "11" || className === "12") {
            route = `/streams/${cls._id}`;
          } else {
            route = `/subjects/${cls._id}`;
          }

          return (
            <ClassCard
              key={cls._id}
              id={cls._id}
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