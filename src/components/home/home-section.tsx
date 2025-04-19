import { useEffect, useRef, useState } from "react";
import attachment_icon from "../../assets/attachment.svg";
import microphone_icon from "../../assets/microphone.svg";
import send_icon from "../../assets/send.svg";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const showAttachmentOptions = () => {
    setShowModal(!showModal);
  };

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <div className="bg-white w-full h-full font-primary px-4">
      <div className="flex flex-col justify-between items-center w-full h-full py-10">
        <div></div>

        
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 h-auto sm:h-[64px] px-4 py-3 sm:px-5 sm:py-0 rounded-lg w-full sm:w-[95%] md:w-[720px] lg:w-[910px] gap-3 sm:gap-2">
          <input
            type="text"
            placeholder="Ask Anything"
            className="w-full bg-gray-100 outline-none"
          />

          <div className="flex gap-3 items-center sm:justify-end">
            {/* Attachment Icon + Modal */}
            <div className="relative">
              <img
                src={attachment_icon}
                alt="icon"
                className="w-6 h-6 hover:cursor-pointer"
                onClick={showAttachmentOptions}
              />

              {showModal && (
                <div
                  ref={modalRef}
                  className="absolute bottom-full mb-2 left-0 bg-white border rounded-md shadow-lg z-50 w-48"
                >
                  <div className="text-sm hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer">
                    Send File
                  </div>
                  <div className="text-sm hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer">
                    Attach Screenshot
                  </div>
                </div>
              )}
            </div>

           
            <img
              src={microphone_icon}
              alt="icon"
              className="w-6 h-6 hover:cursor-pointer"
            />
            <div className="p-2 bg-blue-500 rounded-lg">
              <img
                src={send_icon}
                alt="icon"
                className="w-6 h-6 hover:cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
