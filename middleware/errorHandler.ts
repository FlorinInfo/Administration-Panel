import { Request, Response, NextFunction } from "express";
const {logEvents} = require('./logger');

interface Err {
    name: string;
    message: string;
    stack:string;
}

const errorHandler = (err:Err, req:Request, res:Response, next:NextFunction) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500; // server error
    res.status(status);
    res.json({ message: err.message });
}

module.exports = errorHandler;