import axios from "axios";
import { BASE_URL } from "./baseURL.js";

export const Services_CompareFingerprint = async (fingerprint, reactiveServer) => {
  try {

    const { data } = await axios.post(`${BASE_URL}/comparacion/obtenerComparacion`, { imagenBase64: fingerprint, reactiveServer });

    if(data === "COMPLETADO") return data;

    const { result, cedula } = data;


    if(result === true) {

      return { result : true, cedula : cedula };

    }else{
      return { result: false, cedula: "" };
    }
  } catch (error) {
    console.error("Error desde compare.services.js - CompareFingerprints");
    console.error(error);
  }
};
