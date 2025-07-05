const data = [{ id: 1, idDisp: "esp32-1", temp: 35, hum: 60 },
            { id: 2, idDisp: "esp32-2", temp: 45, hum: 15 },
            { id: 3,idDisp: "esp32-3", temp: 3, hum: 20 }];

export const getAllMediciones = (req, res) => {
    res.json(data);
}