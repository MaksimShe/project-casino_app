import { Input } from '@/shared/Input';

const chatInfo = {
  online: 243,
  friends: 12,
  playing: 45,
};

const messages = [
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
      <div className="text-white">
        <p className="text-center text-2xl font-bold">
          L
          <span className="relative inline-block">
            ı
            <span className="absolute top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-t from-[#FF0047] to-[#FF417B] shadow-[0px_0px_7.1px_3px_#FF0B50]" />
          </span>
          ve chat
        </p>
        <div className="mt-1 flex w-full items-center justify-between gap-4 border-t-1 pt-1">
          <p>{chatInfo.online} online</p>
          <p className="text-[#E59603]">{chatInfo.friends} friends</p>
          <p>{chatInfo.playing} playing</p>
        </div>
      </div>

      <div className="mt-4 flex h-[83%] flex-col items-center overflow-y-auto">
        {messages.map(message => (
          <div
            key={`${message.messageBody} + ${message.time} + ${message.author.username}`}
            className="mb-3 w-11/12 rounded-xl bg-[#24243F] p-4 shadow-[0px_2px_10px_0px_#BFD8FF33]"
          >
            <div className="flex items-center justify-between border-b pb-1.5">
              <div className="flex items-center gap-4 font-bold text-white">
                <p className="w-12 rounded-2xl bg-[linear-gradient(116deg,_#3A88FF_-6%,_#004BBC_84%)] p-1 text-center font-medium">
                  {message.author.hzSomeV}
                </p>
                <p>{message.author.username}</p>
              </div>
              <p>{message.time}</p>
            </div>

            <div className="mt-2">
              <p>{message.messageBody}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex w-full items-center gap-2">
        <div className="flex-1">
          <Input
            placeholder="Write a message..."
            className="h-12 w-full rounded-4xl bg-[#7C7CE854] text-white"
          />
        </div>
        <button className="h-12 w-12 shrink-0 rounded-4xl bg-[#7C7CE854] text-2xl font-black text-white">
          ↑
        </button>
      </div>
    </div>
  );
};
