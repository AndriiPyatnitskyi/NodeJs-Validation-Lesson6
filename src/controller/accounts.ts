import {Request, Response} from 'express';
import * as fs from 'fs';
import {Role} from "../dto/account";
// import {Role, Account} from "../dto/account";

const jwt = require("jsonwebtoken");
const secretKey = "mySecretKey";
// const models = require("../server");
const Account = require("../server");
const filePath = "./accounts.json";

const getAccounts: any = async (req: Request, res: Response) => {
    let find = await Account.default.find();
    res.send(find);
};

const getAccountById: any = async (req: Request, res: Response) => {
    const result = await Account.default.findById(req.params.id);

    if (result) {
        res.send(result);
    } else {
        res.status(404).send();
    }
};

const createAccount: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const accountName: String = req.body.name;
    const accountRole: Role = req.body.role;

    const role = accountRole ? accountRole : Role.USER;

    const token = jwt.sign(
        {account_name: accountName, role: accountRole},
        secretKey,
        {
            expiresIn: "2h",
        }
    );

    const result = await Account.default.create({name: accountName, token: token, role: role});

    res.send(result);
};

const updateAccount: any = async (req: Request, res: Response) => {

    if (!req.body) return res.sendStatus(400);

    await Account.default.findByIdAndUpdate(req.params.id, {name : req.body.name})
    const result = await Account.default.findById(req.params.id);

    if (result) {
        res.send(result);
    } else {
        res.status(404).send(req.params.id);
    }
};

const deleteAccount: any = async (req: Request, res: Response) => {
    let result = await Account.default.findByIdAndRemove(req.params.id);

    if (result) {
        res.sendStatus(204);
    } else {
        res.status(404).send();
    }
};

const getAccountTokensByAccountId: any = async (req: Request, res: Response) => {
    const result = await Account.default.findById(req.params.id);

    if (result) {
        res.send(result.token);
    } else {
        res.status(404).send();
    }
};

const createAccountToken: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const account = await Account.default.findById(req.params.id);

    if (!account) {
        res.status(404).send(req.params.id);
    }

    await Account.default.findByIdAndUpdate(req.params.id,
        {token: jwt.sign(
                {account_name: account.name},
                secretKey,
                {
                    expiresIn: "2h",
                }
            )});

    let result = await Account.default.findById(req.params.id, 'token');

    if (result) {
        res.send(result);
    } else {
        res.sendStatus(500);
    }
};

const updateAccountToken: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const accountSourceToken: String = req.body.sourceToken;
    const accountTargetToken: String = req.body.targetToken;

    const account = await Account.default.findById(req.params.id);

    if (!account) {
        res.status(404).send(req.params.id);
    }

    if (account.token !== accountSourceToken) {
        res.status(404).send(req.params.id);
    }


    await Account.default.findByIdAndUpdate(req.params.id,
        {
            token: accountTargetToken
        });

    let result = await Account.default.findById(req.params.id, 'token');

    if (result) {
        res.send(result);
    } else {
        res.sendStatus(500);
    }
};

const deleteAccountToken: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const account = await Account.default.findById(req.params.id);

    if (!account) {
        res.status(404).send(req.params.id);
    }

    await Account.default.findByIdAndUpdate(req.params.id,
        {
            token: ''
        });

    let result = await Account.default.findById(req.params.id);

    if (result) {
        res.send(result);
    } else {
        res.sendStatus(500);
    }
};

export default {
    getAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountTokensByAccountId,
    createAccountToken,
    updateAccountToken,
    deleteAccountToken
};

