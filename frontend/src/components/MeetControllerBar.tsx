import React, { useState } from "react";
import {
  LucideScreenShare,
  LucideScreenShareOff,
  CircleIcon,
  PresentationIcon,
} from "lucide-react";
import {
  MediaScreenStreamContext,
  ProviderScreenProps,
} from "@/app/context/ScreenStream";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "./ui/button";
import EndMeetButton from "./EndMeetButton";
import SettingButton from "./SettingButton";
import { useStartUserStream } from "@/app/hooks/useStartStream";
import { useStopUserStream } from "@/app/hooks/useStopStream";
import ChatButton from "./ChatButton";
import AudioVideoButton from "./AudioVideoButton";

const MeetControllerBar = (props: { remoteSocketId: string }) => {
  const { remoteSocketId } = props;

  const { userScreenStream } = React.useContext(
    MediaScreenStreamContext
  ) as ProviderScreenProps;

  const [whiteboard, setWhiteboard] = useState<boolean>(true);

  const {  handleStartScreenShareStream } =
    useStartUserStream();
  const { handleStopScreenShareStream } =
    useStopUserStream();

  return (
    <div className="flex flex-row ">
      <div className="sm:w-auto rounded-lg bg-slate-600 px-3 mx-auto py-2">
        <div
          className="flex flex-row h-full w-full items-center justify-center gap-4"
          id="tools-container"
        >
          {/* Audio Video Button */}
          <AudioVideoButton />

          {/* Screen Share Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  className={userScreenStream ? "bg-primary" : "bg-foreground"}
                  onClick={
                    userScreenStream
                      ? handleStopScreenShareStream
                      : handleStartScreenShareStream
                  }
                >
                  {userScreenStream ? (
                    <LucideScreenShare />
                  ) : (
                    <LucideScreenShareOff />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {userScreenStream
                    ? "Stop screen share"
                    : "Start screen share"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Chat Button */}
          <ChatButton remoteSocketId={remoteSocketId} />

          {/* recording button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button size={"icon"} className="bg-foreground">
                  <CircleIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start Record</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* whiteboard button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  className={whiteboard ? "bg-primary" : "bg-foreground"}
                  onClick={() => setWhiteboard(!whiteboard)}
                >
                  <PresentationIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Whiteboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Setting Button */}
          <SettingButton />

          {/* End Call Button */}
          <EndMeetButton />
        </div>
      </div>
    </div>
  );
};

export default MeetControllerBar;
