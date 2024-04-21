import React, { useEffect, useState } from "react";

import { LectorIndex } from "../../components/LectorIndex/LectorIndex";
import { RelojIndex } from "../../components/RelojIndex/RelojIndex";

import { CompareContextProvider } from "../../context/compare.context";

import "./index.css";

export const Index = ({ appUsability }) => {

  let [renderCounter, _] = useState(0);

  useEffect(() => {

    renderCounter++;

    if(renderCounter > 1) return;

    setInterval(() => {
        window.location.reload()
    }, 180000);

  }, []);

  return (
    <section className="indexPage">
      <CompareContextProvider>
        <RelojIndex appUsability={appUsability}/>
        <LectorIndex />
      </CompareContextProvider>
    </section>
  );
};
