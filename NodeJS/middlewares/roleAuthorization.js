const roleAuthorization = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.userId) {
            return res.status(401)
        }

        if (!requiredRoles.includes(req.roleId)) {
            return res.sendStatus(403)
        }
        return next();
    };
}

module.exports = roleAuthorization;
