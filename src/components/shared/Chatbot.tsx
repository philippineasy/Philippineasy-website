'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCommentDots, faRobot, faPaperPlane, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition duration-300"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} className="text-card-foreground text-2xl" />
      </button>
      <div className={`chatbox bg-card rounded-lg shadow-2xl overflow-hidden absolute right-0 bottom-20 w-80 md:w-96 ${isOpen ? 'open' : ''}`}>
        <div className="bg-primary text-card-foreground p-4 flex justify-between items-center">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faRobot} className="mr-2" />
            <h3 className="font-bold">Assistant Philippin'Easy</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-card-foreground">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-4 h-64 overflow-y-auto flex flex-col hide-scroll">
          <div className="message bot">Bonjour ! Posez-moi votre question sur les Philippines.</div>
        </div>
        <div className="border-t p-4">
          <div className="flex">
            <input
              type="text"
              className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Votre message..."
            />
            <button className="px-4 py-2 bg-primary text-card-foreground rounded-r-lg hover:bg-primary/90 transition duration-300">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" /> Assistant IA (Simulation)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
