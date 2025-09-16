import { ChatInterface } from '@/components/chat/chat-interface';

export const metadata = {
  title: 'AI Chat - FirstStep',
  description: 'Ask our AI assistant specialized first aid questions.',
};

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <ChatInterface />
    </div>
  );
}
