import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;
const jsonPath = path.join(__dirname, "./data.json");

// Función para leer siempre el archivo actualizado
function readData() {
  const json = fs.readFileSync(jsonPath, "utf-8");
  return JSON.parse(json);
}

export const getAllMediciones = () => {
  return readData();
};

export const getMedicionById = (id) => {
  const data = readData();
  const numId = Number(id);
  return data.find((p) => p.id === numId);
};

export const getMedicionesSearch = (search) => {
  const data = readData();
  return data.filter(
    (p) =>
      p.idDisp.includes(search) ||
      p.temp.toString().includes(search) ||
      p.hum.toString().includes(search)
  );
};

export const nuevaMedicion = (datos) => {
  const data = readData();
  const nuevaMed = {
    id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
    ...datos,
  };
  data.push(nuevaMed);
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  return nuevaMed;
};

export const actualizarMedicion = (id, nuevosDatos) => {
  const data = readData();
  const numId = Number(id);
  const index = data.findIndex((p) => p.id === numId);
  if (index === -1) return null;
  data[index] = { ...data[index], ...nuevosDatos, id: numId };
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  return data[index];
};

export const eliminarMedicion = (id) => {
  const data = readData();
  const numId = Number(id);
  const index = data.findIndex((p) => p.id === numId);
  if (index === -1) return null;
  const [eliminada] = data.splice(index, 1);
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  return eliminada;
};