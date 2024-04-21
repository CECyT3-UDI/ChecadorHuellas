import { Route, Routes } from "react-router-dom";
import { Index } from "./pages/Index";

import { Header } from "./components/Header/Header";
import { Registro } from "./pages/Registro/Registro";
import { PersonalComparado } from "./pages/PersonalComparado/PersonalComparado";
import { UsersContextProvider } from "./context/users.context";

import "./modules/WebSDK";
import { useEffect, useState } from "react";
import { Services_Authentication } from "./services/users.services";

import axios from "axios";
import { Editar } from "./pages/Editar/Editar";

function App() {
  let [renderCounter, setRenderCounter] = useState(0);
  const [ipAddressResult, setIpAddressResult] = useState(false);
  const [ipAddress, setIpAddress] = useState(null);

  const [appUsability, setAppUsability] = useState(null);

  useEffect(() => {
    setRenderCounter(renderCounter++);

    if (renderCounter != 1) return;

    if (hasLogged() === true) {
      return setIpAddressResult(true);
    }

    getIpAddress();
  }, []);

  async function getIpAddress() {
    await axios.get("https://geolocation-db.com/json/").then(({ data }) => {
      const ipToTest = data.IPv4;
      const resultIpAuthorized = testIp(ipToTest);

      if (resultIpAuthorized === false) {
        return (window.location.href = "https://cecyt3.ipn.mx/");
      }

      setIpAddress(ipToTest);

      setIpAddressResult(resultIpAuthorized);

      auth();
    }).then(() => {
      const resultIp = ipAddress != "148.204.225.152";

      if(resultIp === true) setAppUsability("notTester");
      else if(resultIp === false) setAppUsability("tester");
    });
  }

  async function auth() {
    await new Promise((res, rej) => {
      const password = prompt(
        "SE DETECTÓ UN DISPOSITIVO NUEVO\nINGRESE LA CONTRASEÑA:"
      );

      if (password === null || password.trim() === "") {
        return (window.location.href = "https://cecyt3.ipn.mx/");
      }

      res(password);
    }).then((password) => {
      async function fetchAuthentication() {
        await Services_Authentication(password).then((resultAuthentication) => {
          if (resultAuthentication === false) {
            return (window.location.href = "https://cecyt3.ipn.mx/");
          }
          if (resultAuthentication === true) {
            saveInLocalStorage();
          }
        });
      }

      fetchAuthentication();
    });
  }

  function testIp(ipToTest) {
    const ipsAuthorized = ["187.191.39.157", "148.204.233.1", "148.204.225.152", "148.204.233.11", "148.204.225.54", "148.204.225.103", "148.204.225.105", "148.204.225.106", "148.204.225.249"];

    return ipsAuthorized.includes(ipToTest);
  }

  function saveInLocalStorage() {
    if (window.localStorage.getItem("actual_session_huellas_c3") === null) {
      window.localStorage.setItem("actual_session_huellas_c3", "true");
    }
  }

  function hasLogged() {
    if (window.localStorage.getItem("actual_session_huellas_c3") === null)
      return false;

    return true;
  }

  return (
    <>
      {ipAddressResult === true ? (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Index appUsability={appUsability}/>
              </>
            }
          />

          <Route
            path="/alta"
            element={
              <>
                <Header />
                <Registro />
              </>
            }
          />
          
          <Route
            path="/editar"
            element={
              <>
                <Header />
                <Editar />
              </>
            }
          />

          <Route
            path="/personal"
            element={
              <>
                <Header />
                <UsersContextProvider>
                  <PersonalComparado />
                </UsersContextProvider>
              </>
            }
          />
        </Routes>
      ) : null}
    </>
  );
}

export default App;
