import { Inngest } from "inngest";

export const inngest = new Inngest({ 
  id: "shelby-serves",
  name: "Shelby Serves" 
});

export const processVideo = inngest.createFunction(
  { id: "process-video" },
  { event: "video/uploaded" },
  async ({ event, step }) => {
    console.log("Processing video:", event.data.videoId);
    return { success: true };
  }
);
