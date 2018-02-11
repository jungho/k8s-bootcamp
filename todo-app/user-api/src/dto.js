/**
 * @swagger
 * definitions:
 *     User:
 *         required:
 *             - email
 *             - firstName
 *             - lastName
 *         properties:
 *             id:
 *                 type: string
 *             email:
 *                 type: string
 *             firstName:
 *                 type: string
 *             lastName:
 *                 type: string
 */
class UserDTO {
    constructor({_id, email, firstName, lastName}) {
        this.id = _id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

module.exports = UserDTO;