const roleAuthorization = (requiredRoles) => {
    console.log(requiredRoles)
    return (req, res, next) => {
        if (!req.userId) {
            return res.status(401)
        }

        if (!requiredRoles.includes(req.roleId)) {
            return res.sendStatus(403)
        }

        console.log(`User with role ID ${req.roleId} has access`);
        return next();
    };
}

module.exports = roleAuthorization;
