const roleAuthorization = (requiredRoles) => {
    return (req, res, next) => {
        console.log("verifyPermissions middleware triggered 2");

        // Ensure user is authenticated
        if (!req.userId) {
            console.log("User is not authenticated");
            return res.status(401).json({ message: "User is not authenticated" });
        }

        // Check if the user has one of the required roles
        if (!requiredRoles.includes(req.roleName)) {
            console.log(`User with role ID ${req.roleName} does not have access`);
            return res.status(403).json({ message: "User does not have the required permissions" });
        }

        console.log(`User with role ID ${req.roleName} has access`);
        return next();
    };
}

module.exports = roleAuthorization;

