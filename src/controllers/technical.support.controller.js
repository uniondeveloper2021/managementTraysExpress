const TechnicalSupport = require('../models/technical.support.model')
const User = require('../models/user.model')

const getAllTechnicalSupportGeneralIsAnsweredTrue = async (req, res) => {
    await getAllTechnicalSupportGeneral(req, res, true);
}

const getAllTechnicalSupportGeneralIsAnsweredFalse = async (req, res) => {
    await getAllTechnicalSupportGeneral(req, res, false);
}

const getAllTechnicalSupportGeneral = async (req, res, status) => {
    try {
        const information = await TechnicalSupport.aggregate([
            { $match: { is_answered: status } },
            {
                $lookup: {
                    from: 'users', localField: 'id_user',
                    foreignField: '_id', as: 'user'
                }
            },
        ])

        return res.status(201).json({
            status: 201, data: information,
            message: "Tipos listados satisfactoriamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getAllTechnicalSupportGeneralByUserIsAnsweredTrue = async (req, res) => {
    await getAllTechnicalSupportGeneralByUser(req, res, true);
}

const getAllTechnicalSupportGeneralByUserIsAnsweredFalse = async (req, res) => {
    await getAllTechnicalSupportGeneralByUser(req, res, false);
}

const getAllTechnicalSupportGeneralByUser = async (req, res, status) => {
    try {
        const { id_user } = req.params;
        const userFound = await User.findById(id_user);
        if (!userFound) return res.status(400).json({ status: 400, message: "Usuario no encontrado" });

        const information = await TechnicalSupport.aggregate([
            { $match: { id_user: userFound['_id'] } },
            { $match: { is_answered: status } },
            {
                $lookup: {
                    from: 'users', localField: 'id_user',
                    foreignField: '_id', as: 'user'
                }
            },
        ])
        return res.status(201).json({
            status: 201, data: information,
            message: "Tipos listados satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const addTechnicalSupport = async (req, res) => {
    const { title, description, url_img, date, id_user } = req.body;
    try {
        const userFound = await User.findById(id_user);

        if (!userFound) return res.status(400).json({ status: 400, message: "Usuario no encontrado" });

        const newTechnicalSupport = new TechnicalSupport({
            title, description, url_img, date, id_user, answer: '', status: true, is_answered: false
        });

        await newTechnicalSupport.save();
        return res.status(201).json({ status: 201, message: "Solicitud de envio realizado correctamente" });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const replyTechnicalSupport = async (req, res) => {
    try {
        const { id_technical } = req.params;

        const { answer } = req.body;

        const technicalFound = await TechnicalSupport.findById(id_technical);

        if (!technicalFound) return res.status(400).json({ status: 400, message: "Soporte tecnico no encontrado" });

        await TechnicalSupport.findByIdAndUpdate(id_technical, {
            answer, is_answered: true
        });

        return res.status(201).json({
            status: 201,
            message: "Soporte tecnico modificado correctamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    getAllTechnicalSupportGeneralIsAnsweredTrue,
    getAllTechnicalSupportGeneralIsAnsweredFalse,
    getAllTechnicalSupportGeneralByUserIsAnsweredTrue,
    getAllTechnicalSupportGeneralByUserIsAnsweredFalse,
    addTechnicalSupport,
    replyTechnicalSupport
}