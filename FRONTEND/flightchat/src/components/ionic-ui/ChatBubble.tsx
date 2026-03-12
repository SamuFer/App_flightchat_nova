interface Props {
  message: string;
  author: string;
  own?: boolean;
}

import { Link } from 'react-router-dom';

const ChatBubble: React.FC<Props> = ({ message, author, own = false }) => {
  console.log('🧩 Missatge rebut al ChatBubble →', { author, message, own });

  const esHTML = message.trim().startsWith('<img');

  const renderContent = (text: string) => {
    const regex = /https:\/\/maps\.google\.com\/\?q=([\d.-]+),([\d.-]+)/;
    const match = text.match(regex);

    if (match) {
      const lat = match[1];
      const lon = match[2];
      return (
        <Link
          to={`/geolocation?lat=${lat}&lon=${lon}`}
          className="text-blue-300 underline hover:text-blue-100"
        >
          📍 Obre ubicació en el mapa
        </Link>
      );
    }

    return <p className="text-sm">{text}</p>;
  };
const hashColor = (name: string): string => {
    const colors = [
      'text-red-600',
      'text-green-600',
      'text-blue-600',
      'text-lime-600',
      'text-pink-600',
      'text-yellow-600',
      'text-teal-600',
      'text-indigo-600'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className={`my-2 flex ${own ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-lg px-4 py-2 ${own ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
        <p className={`font-semibold ${hashColor(author)}`}>{author}</p>
        {esHTML ? (
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        ) : (
          renderContent(message)
        )}
      </div>
    </div>
  );
};

export default ChatBubble;