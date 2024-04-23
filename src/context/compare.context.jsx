import React, { createContext, useEffect, useState } from "react";
import { Services_CompareFingerprint } from "../services/compare.services";

export const CompareContext = createContext();

export const CompareContextProvider = ({ children }) => {
  const [resultCompare, setResultCompare] = useState(null);
  const [compareCedula, setCompareCedula] = useState(null);

  const [reactiveServerTime, setReactiveServerTime] = useState(null);

  let [renderCounter, setRenderCounter] = useState(0);

  function CompareUser(fingerprint) {
    const fetchCompare = async () => {

      const data = await Services_CompareFingerprint(fingerprint, false);

      if(data === undefined) throw new Error();

      const { result, cedula } = data;

      setCompareCedula(cedula);
      setResultCompare(result);

    };

    fetchCompare().catch(error => {
      console.log(error);
      setCompareCedula("");
      setResultCompare(false);
      alert("Error en la conexión al servidor");
    });
  }

  function ReactiveServer(){

    const date = new Date();

    const hora = `a las ${date.toLocaleTimeString()} hrs`;

    setReactiveServerTime(
      <p style={{color: "darkred"}}>Estableciendo conexión con el servidor...</p>
    )

    const fetchReactiveServer = async () => {
      await Services_CompareFingerprint("", true).then((data) => {

        if(data == undefined) throw new Error();

        console.warn(`REACTIVACION DEL SERVIDOR ${data} - ${hora}`);

        setReactiveServerTime(
          <p style={{color: "rgba(0,0,0,.65)"}}>Ultima reactivación del servidor {hora}.</p>
        );
      }).catch(error => {
        setReactiveServerTime(
          <p style={{color : "red"}}>Error en la reactivación del servidor {hora}.</p>
        );
        console.warn(`ERROR EN LA REACTIVACION DEL SERVIDOR ${error} - ${hora}`);
      })
    };

    fetchReactiveServer();

  }

  useEffect(() => {
    setRenderCounter(renderCounter++);

    if(renderCounter > 1) return;

    setInterval(() => {
      ReactiveServer()
    }, 60000);

    ReactiveServer();
  }, []);

  return (
    <CompareContext.Provider
      value={{
        CompareUser,
        setResultCompare,
        setReactiveServerTime,
        compareCedula,
        resultCompare,
        reactiveServerTime
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
