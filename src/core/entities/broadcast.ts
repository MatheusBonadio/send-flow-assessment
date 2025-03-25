export class Broadcast {
  id: string;
  name: string;
  scheduledAt: Date;
  body: string;
  connectionID: string;
  connectionName?: string;
  contactsIDs: string[];

  constructor(
    id: string,
    name: string,
    scheduledAt: Date,
    body: string,
    connectionID: string,
    contactsIDs: string[],
    connectionName?: string,
  ) {
    this.id = id;
    this.name = name;
    this.scheduledAt = scheduledAt;
    this.body = body;
    this.connectionID = connectionID;
    this.contactsIDs = contactsIDs;
    this.connectionName = connectionName ?? '';
  }
}