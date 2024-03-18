import {
  MessageCircleMoreIcon,
  PaperclipIcon,
  SendHorizonalIcon,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SocketContext } from "@/app/context/SocketContext";
import { useState, useContext, useRef, useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";
import { Message } from "@/type";
import MessageDiv from "./MessageDiv";
import FileTransfer from "./FileTransfer";

function ChatButton(props: { remoteSocketId: string }) {
  const { remoteSocketId } = props;
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputChatMessage, setInputChatMessage] = useState<
    string | undefined
  >();

  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const socket = useContext(SocketContext) as Socket;
  const chatBoxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxContainerRef.current) {
      chatBoxContainerRef.current.scrollTo(
        0,
        chatBoxContainerRef.current.scrollHeight
      );
    }
  }, [messages]);

  useEffect(() => {
    if (opened) {
      setUnreadMessageCount(0);
    } else {
      setUnreadMessageCount((e) => e + 1);
    }
  }, [opened, messages]);

  const toggleChatBox = useCallback(() => setOpened((e) => !e), []);

  const handleOnMessage = useCallback((data: any) => {
    const { from, message, user, self = false } = data;
    setMessages((e: Message[]) => [
      ...e,
      {
        from: user.username,
        displayPicture: user.displayPicture,
        message: message.message,
        isSelf: self,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const handleChatInboxKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        if (inputChatMessage && inputChatMessage.trim() !== "") {
          const message: Message = { message: inputChatMessage };
          socket.emit("chat:message", { to: remoteSocketId, message });
          setInputChatMessage("");
        }
      }
    },
    [socket, inputChatMessage]
  );

  useEffect(() => {
    socket.on("chat:message", handleOnMessage);

    return () => {
      socket.off("chat:message", handleOnMessage);
    };
  }, [handleOnMessage]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Sheet>
            <SheetTrigger>
              <Button size={"icon"} className="bg-foreground">
                <MessageCircleMoreIcon />
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col justify-between">
              <SheetHeader>
                <SheetTitle>Chat</SheetTitle>
                <SheetDescription>Start a conversation</SheetDescription>
              </SheetHeader>
              <div
                ref={chatBoxContainerRef}
                className="w-full h-full rounded-md border overflow-y-auto"
              >
                {messages && messages.length > 0 && (
                  <div className="flex-grow max-w-[752px]">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="col-span-1">
                        <ul className="list-none">
                          {messages &&
                            messages.length > 0 &&
                            messages.map((e) => (
                              <li key={e.from}>
                                <MessageDiv {...e} />
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                {messages && messages.length <= 0 && (
                  <div className="flex h-full w-full items-center justify-center font-sans">
                    <p>No new messages</p>
                  </div>
                )}
              </div>
              <SheetFooter>
                <div className="grid w-full gap-2">
                  <Textarea
                    value={inputChatMessage}
                    onChange={(e: any) => setInputChatMessage(e.target.value)}
                    placeholder="Type your message here."
                    typeof="text"
                  />
                  <div className="flex gap-2">
                    <Button className="w-full">
                      Send message
                      <SendHorizonalIcon />
                    </Button>
                    <FileTransfer />
                  </div>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chat</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ChatButton;
