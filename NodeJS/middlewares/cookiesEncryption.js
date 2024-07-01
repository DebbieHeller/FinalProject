const cookiesEncryption = (req, res, next) => {
    const accessToken = jwt.sign(
        {
    
          userId: user.UserId,
          roleName: user.RoleName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );
    res.cookie("accessToken"),accessToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 5 * 60 * 1000,
      };
    
    next();
};

module.exports = cookiesEncryption


 