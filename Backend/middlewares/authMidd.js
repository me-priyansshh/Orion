import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        
        const token = req.cookies?.token || req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).send({
                message: "User not authenticated"
            });
        };

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
           return res.status(401).send({
                message: "Invalid Token"
            });
        };

        req.id = decoded.userId;

        next();

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Unauthorized access"
        });
    }
};

export const getSuggestedUsers = async (req, res) => {

};



    