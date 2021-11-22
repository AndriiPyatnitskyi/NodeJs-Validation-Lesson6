import {Role} from "../dto/account";

const accountSchema = {
    body: {
        name: { type: 'string', min: 3, max: 15 },
        role: {type: 'string', optional: true, enum: [ Role.USER.toString(), Role.ADMIN.toString(), Role.ANONYMOUS.toString() ]}
    },
};

export default accountSchema;
