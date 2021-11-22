const accountSchema = {
    body: {
        name: { type: 'string', min: 3, max: 15 }
    },
};

export default accountSchema;
