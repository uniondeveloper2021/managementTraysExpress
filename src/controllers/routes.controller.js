const Route = require('../models/routes.model')

const postRoute = async (req, res) => {
    try {
        const { name } = req.body;
        const [routeFound] = await Promise.all([
            Route.findOne({ name }),
        ])
        if (routeFound != null) return res.status(202).json({
            status: 202,
            message: "El nombre ya existe"
        });

        const number = Math.floor((Math.random() * (1000 - 1 + 1)) + 1);

        const newRoute = new Route({ name, number, status: true, status_free: true })
        const routeSaved = await newRoute.save();
        return res.status(201).json({ status: 201, data: routeSaved });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getRoute = async (req, res) => {
    try {
        // const query = { status: true }
        // const [total, routes] = await Promise.all([
        //     Route.countDocuments(query),
        //     Route.find(query)
        // ])

        const information = await Route.aggregate([
            {
                $lookup: {
                    from: 'establishmentroutes', localField: '_id',
                    foreignField: 'id_route', as: 'establishment'
                }
            },
        ]);
        return res.status(201).json({
            status: 201,
            //  total, 
            data: information,
            message: "Todas las rutas disponibles"
        });
    } catch (error) {
        res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const searchRouteByName = async (req, res) => {
    try {
        const name = req.params.name;
        const routeFound = await Route.find({
            name: { $regex: name }
        });

        if (!routeFound)
            return res.status(400).json({
                status: 400,
                message: "La ruta no se encuentra en la base de datos"
            });

        return res.status(201).json({
            status: 201, data: routeFound,
            message: "Ruta encontrado satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    postRoute, getRoute, searchRouteByName
}