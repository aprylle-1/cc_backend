/** 
 * Routes for register and login
 * Each route should return a JWT signed token
*/

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/token");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../helpers/expressError");

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next){
    try{
        const validator = jsonschema.validate(req.body, userRegisterSchema)
        if (!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        let { username, firstname, lastname, password }  = req.body;
        const newUser = await User.register(username, firstname, lastname, password);
        const token = createToken(newUser)
        return res.status(201).json({
            token : token
        })
    }
    catch (err){
        next(err);
    }

});

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next){
    try{
        console.log(req.body)
        const validator = jsonschema.validate(req.body, userAuthSchema)
        if (!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        let { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        res.status(200).json({
            token : token
        })
    }
    catch(err){
        next(err);
    }
})

module.exports = router;