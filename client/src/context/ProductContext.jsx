import React, { createContext, useContext } from "react";

const ProductContext = createContext();

const products = [
  {
    id: 1,
    subject: "physics",
    title: "Physics Complete Notes",
    description: "Full chapter theory, formulas, diagrams & important questions.",
    pages: 120,
    price: 99,
    type: "Notes",
    rating: 4,
    reviews: 152
  },
  {
    id: 2,
    subject: "physics",
    title: "Physics Sample Paper Set",
    description: "Practice sample papers based on latest exam pattern.",
    pages: 60,
    price: 79,
    type: "Sample Paper",
    rating: 5,
    reviews: 210
  },
  {
    id: 3,
    subject: "chemistry",
    title: "Chemistry Previous Year Questions",
    description: "PYQs with solutions and explanations.",
    pages: 85,
    price: 89,
    type: "PYQ",
    rating: 4,
    reviews: 134
  }
];

export function ProductProvider({ children }) {
  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
