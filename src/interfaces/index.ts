export interface IConnection {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IContact {
    id: string;
    name: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBroadcast {
    id: string;
    name: string;
    status: 'scheduled' | 'sent';
    scheduledTime: string;
    messageBody: string;
    connectionID: string;
    connectionName: string;
    contactsIDs: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}