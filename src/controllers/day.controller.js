const Day = require('../models/day.model')

const postDay = async (req, res) => {
    try {
        const { number, day } = req.body;
        const newDay = new Day({
                number, day, status: true
            })
        const daySaved = await newDay.save();
        return res.status(201).json({
            status: 201, data: daySaved,
            message: "Dia creado satisfactoriamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    postDay
}