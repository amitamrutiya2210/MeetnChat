"use client";

import { Input } from "@/components/ui/input";
import {
  Mail,
  UsersRound,
  MessageCircleMore,
  SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Room() {
  const [selectedTab, setSelectedTab] = useState("Chats");
  const tags = Array.from({ length: 20 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-4 p-4">
      <section className="flex-grow  bg-[#1f1f1f] rounded-3xl xl:w-1/4 md:w-1/3 md:block hidden box-border">
        <div className="Search p-5 mb-8">
          <div className="grid  w-full max-w-full items-center gap-1.5">
            <Input
              className="rounded-3xl"
              type="search"
              id="search"
              placeholder="Search"
            />
            {/* TODO: Add Search Icon */}
          </div>
        </div>
        <div className="Menu flex justify-evenly mb-4">
          <Button
            variant="outline"
            className={`p-8 rounded-2xl ${
              selectedTab === "Chats" ? "bg-primary" : ""
            }`}
            onClick={() => setSelectedTab("Chats")}
          >
            <div className="flex flex-col justify-center items-center">
              <MessageCircleMore />
              <p>Chats</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className={`p-8 rounded-2xl ${
              selectedTab === "Contacts" ? "bg-primary" : ""
            }`}
            onClick={() => setSelectedTab("Contacts")}
          >
            <div className="flex flex-col justify-center items-center">
              <UsersRound />
              <p>Contacts</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className={`p-8 rounded-2xl ${
              selectedTab === "Invite" ? "bg-primary" : ""
            }`}
            onClick={() => setSelectedTab("Invite")}
          >
            <div className="flex flex-col justify-center items-center">
              <Mail />
              <p>Invite</p>
            </div>
          </Button>
        </div>
        {selectedTab === "Chats" && (
          <div className="ChatList h-1/2 rounded-md border px-4 mb-8 overflow-auto">
            <div className="p-4">
              <h4 className="mb-7 text-md font-bold leading-none text-center">
                Your Recent Chat
              </h4>
              {tags.map((tag) => (
                <>
                  <div key={tag} className="flex justify-between">
                    <div className="left-side flex">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="chat flex-col ml-5">
                        <div className="name">John Doe</div>
                        <div className="message text-gray-400 text-sm">
                          Hello My name is John Doe
                        </div>
                      </div>
                    </div>
                    <div className="right-side text-gray-400 text-xs">
                      03:36
                    </div>
                  </div>
                  <Separator className="my-2" />
                </>
              ))}
            </div>
          </div>
        )}
        {selectedTab === "Contacts" && (
          <div className="Contacts">Contacts Content</div>
        )}
        {selectedTab === "Invite" && (
          <div className="Invite">Invite Content</div>
        )}
        <div className="Profile rounded-full flex justify-between items-center bg-secondary mx-6 gap-3">
          <div className="flex flex-row items-center">
            <Avatar className="h-[70px] w-[70px]">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="chat flex-col ml-5">
              <div className="name">John Doe</div>
              <div className="message text-gray-400 text-sm">Online</div>
            </div>
          </div>
          <div className="pr-6">
            <SettingsIcon />
          </div>
        </div>
      </section>
      <main className="flex-grow bg-[#181818] rounded-3xl xl:w-1/2 md:w-2/3"></main>
      <section className="flex-grow bg-[#1f1f1f] rounded-3xl xl:w-1/4 md:block hidden"></section>
    </div>
  );
}
