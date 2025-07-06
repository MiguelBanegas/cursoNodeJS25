import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;

const jsonPath = path.join(__dirname, "./data.json");
const json = fs.readFileSync(jsonPath, "utf-8");
const data = JSON.parse(json);

export const getAllMediciones = () => {
    return data; // Retorna todos los productos del contenido del JSON
}

export const getMedicionById = (id) => {
    return data.find(p => p.id === id);   // Retorna un producto por ID
}  
export const getMedicionesSearch = (search) => {
    return data.filter(p => p.idDisp.includes(search) || p.temp.toString().includes(search) || p.hum.toString().includes(search)); // Retorna productos que coincidan con la búsqueda
}