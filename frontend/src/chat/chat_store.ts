import {IMessage} from "../components/message_row";

export interface IConnectedUser {
  id: string;
  username: string;
}

export class ChatStoreService {

    private static instance: ChatStoreService;
    private users: Map<string, IConnectedUser>;
    private messages: Map<string, IMessage[]>;

    private constructor() {
        this.users = new Map();
        this.messages = new Map();
    }

    public static getInstance(): ChatStoreService {
        if (!ChatStoreService.instance) {
            ChatStoreService.instance = new ChatStoreService();
        }

        return ChatStoreService.instance;
    }

    public setUsers(users: IConnectedUser[]) {
        users.forEach(user => {
            this.users.set(user.id, user);
        });
    }

    public addMessage(msg: IMessage) {
        const room_id = msg.room_id as string;
        const msgs = this.messages.get(room_id) ?? [];
        msgs.push(msg);
        this.messages.set(room_id, msgs);
    }

    public getUser(id: string) {
        return this.users.get(id) ?? null;
    }

    public getMessages(room_id: string) {
        return this.messages.get(room_id) ?? [];
    }

    public removeUser(id: string) {
        this.users.delete(id);
    }

    public clear() {
        this.users.clear();
        this.messages.clear();
    }
}