const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.'});

    // check for duplicates usernames in the db
    const duplicate = await User.findOne({username: user}).exec();
    if (duplicate) return res.sendStatus(409);
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // store the new user
        const result = await User.create({ 
            "username": user,
            "password": hashedPwd 
        });

        console.log(result)
        res.status(201).json({ 'success': `New user ${user} created!`});
    } catch (error) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };
