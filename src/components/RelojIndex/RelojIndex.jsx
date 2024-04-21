import React, { useState, useEffect, useContext } from "react";

import "./RelojIndex.css";

import { CompareContext } from "../../context/compare.context";

export const RelojIndex = ({ appUsability }) => {
  let [renderCounter, setRenderCounter] = useState(0);
  const [reloj, setReloj] = useState(0);

  const { reactiveServerTime } = useContext(CompareContext);

  const seconds = 179000 / 1000;

  let [timeSeconds, setTimeSeconds] = useState(seconds);

  useEffect(() => {
    setRenderCounter(renderCounter++);

    if (renderCounter === 1) {
      getReloj();
      setInterval(() => {
        getReloj();
      }, 1000);

      setInterval(() => {
        setTimeSeconds(timeSeconds--);
      }, 1000);
    }
  }, []);

  function getReloj() {
    const horas = [
      12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11,
    ];

    const date = new Date();
    let hora = horas[date.getHours()];
    const minutos =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const segundos =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

    setReloj(`${hora}:${minutos}:${segundos}`);
  }

  function getHoraryTime() {
    return new Date().getHours() <= 12 ? "a.m" : "p.m";
  }

  function getHorary() {
    const hour = new Date().getHours();

    if (hour < 12 && hour >= 6) return "Buenos días";
    else if (hour < 18 && hour >= 12) return "Buenas tardes";
    else return "Buenas noches";
  }

  return (
    <section className="seccionReloj">
      <div className="reloj">
        <h2>
          {reloj} <span>{getHoraryTime()}</span>
        </h2>
      </div>
      <div className="horary">
        <h4>¡{getHorary()}!</h4>
      </div>
      <div className="appUsability">
        {appUsability === "notTester" ? null : (
          <p>
            APLICACIÓN DE PRUEBAS
            <br />
            <span>(NO REGISTRAR SALIDAS O ENTRADAS)</span>
          </p>
        )}
      </div>
      <div className="reactiveServer">
        <p>La ventana se actualizará en: {timeSeconds} segundos</p>
        {reactiveServerTime}
        <span className="appVersion">Version 1.3 (Corregida)</span>
      </div>
    </section>
  );
};
