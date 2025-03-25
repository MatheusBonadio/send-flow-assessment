export class Broadcast {
  id: string;
  name: string;
  scheduledAt: Date;
  messageBody: string;
  connectionID: string;
  connectionName?: string;
  contactsIDs: string[];

  constructor(
    id: string,
    name: string,
    scheduledAt: Date,
    messageBody: string,
    connectionID: string,
    contactsIDs: string[],
    connectionName?: string,
  ) {
    this.id = id;
    this.name = name;
    this.scheduledAt = scheduledAt;
    this.messageBody = messageBody;
    this.connectionID = connectionID;
    this.contactsIDs = contactsIDs;
    this.connectionName = connectionName ?? '';
  }
}