import type { Metadata } from 'next';
import ChatInboxClient from './ChatInboxClient';

export const metadata: Metadata = {
  title: 'Chat visiteurs',
};

export default function AdminChatPage() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-foreground">Chat visiteurs</h1>
        <p className="text-sm text-muted-foreground">
          Conversations du widget du site — tu peux aussi répondre depuis Telegram (fonction «&nbsp;Répondre&nbsp;» sur une notification).
        </p>
      </div>
      <ChatInboxClient />
    </div>
  );
}
