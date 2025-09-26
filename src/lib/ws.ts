import { io, Socket } from 'socket.io-client';
import { env, tokenStore } from '@/lib/api';

export class WS {
  private socket: Socket | null = null;

  connect(base?: string) {
    const url = (base || env.WS_BASE || env.API_BASE || '').replace(/\/+$/,'');
    if (!url) throw new Error('WS base URL not configured');

    const token = tokenStore.get();
    this.socket = io(url, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
      auth: token ? { token } : undefined,
    });

    return this.socket;
  }

  onConnected(cb: (payload: any) => void) {
    this.socket?.on('connected', cb);
  }

  joinChat(chatId: string) {
    this.socket?.emit('join', { chatId });
  }

  typing(chatId: string, typing: boolean) {
    this.socket?.emit('typing', { chatId, typing });
  }

  sendMessage(chatId: string, content: string) {
    this.socket?.emit('message:send', { chatId, content });
  }

  onMessage(cb: (data: any) => void) {
    this.socket?.on('message:new', cb);
  }

  onTyping(cb: (data: any) => void) {
    this.socket?.on('typing', cb);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const ws = new WS();
