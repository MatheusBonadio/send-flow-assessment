export class Message {
  id: string;
  body: string;
  contactID: string;
  contactName?: string;
  broadcastID: string;
  broadcastName: string;
  status: 'scheduled' | 'sent';
  scheduledAt: Date;

  constructor(
    id: string,
    body: string,
    contactID: string,
    broadcastID: string,
    broadcastName: string,
    status: 'scheduled' | 'sent',
    scheduledAt: Date,
    contactName?: string,
  ) {
    this.id = id;
    this.body = body;
    this.contactID = contactID;
    this.contactName = contactName ?? '';
    this.broadcastID = broadcastID;
    this.broadcastName = broadcastName;
    this.status = status;
    this.scheduledAt = scheduledAt;
  }
}
