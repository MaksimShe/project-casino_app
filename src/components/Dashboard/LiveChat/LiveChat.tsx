import { LiveChatHeader } from '@/components/Dashboard/LiveChat/components/LiveChatHeader';
import { LiveChatBody } from '@/components/Dashboard/LiveChat/components/LiveChatBody';
import { LiveChatFooter } from '@/components/Dashboard/LiveChat/components/LiveChatFooter';

export interface ChatInfo {
  online: number;
  friends: number;
  playing: number;
}

export interface Message {
  author: {
    hzSomeV: string;
    username: string;
  };
  time: string;
  messageBody: string;
  img: string | null;
}

const chatInfo: ChatInfo = {
  online: 243,
  friends: 12,
  playing: 45,
};

const messages: Message[] = [
  {
    author: {
      hzSomeV: 'V2',
      username: 'Mia Khalifa',
    },
    time: '12:33',
    messageBody:
      'Hello, i am wanna lose my money! So, who wanna helps me? Its really important mission, cuz i wanna win all that games ',
    img: 'later',
  },
  {
    author: {
      hzSomeV: 'V1',
      username: 'Sasha Grey (Gray)',
    },
    time: '12:35',
    messageBody:
      'Hello, i wanna help u. i really have biiiig experience in this deal, so i can be good partner',
    img: 'later',
  },
  {
    author: {
      hzSomeV: 'V3',
      username: 'John Sins',
    },
    time: '12:37',
    messageBody:
      'Hi, let`s play clash royale! i have 10000 trophies and i guess i can bee good player ',
    img: 'later',
  },
  {
    author: {
      hzSomeV: 'V2',
      username: 'Mia Khalifa',
    },
    time: '12:38',
    messageBody:
      'O, hi, go. But only with hookah! cuz when i smoking, i play veeery well',
    img: 'later',
  },
  {
    author: {
      hzSomeV: 'V1',
      username: 'Comatoze',
    },
    time: '12:38',
    messageBody:
      'O, hi, i wanna win my last cash, what hame u can recommend 4 me? i have exp with all ot these, but i think u can help me with this choose',
    img: 'later',
  },
];

export const LiveChat = () => {
  return (
    <div className="h-full w-full max-lg:rounded-t-2xl max-lg:bg-[#423E69] max-lg:p-10">
      <LiveChatHeader chatInfo={chatInfo} />
      <LiveChatBody messages={messages} />
      <LiveChatFooter />
    </div>
  );
};
