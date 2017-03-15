import * as child from 'child_process';
import * as fetch from "isomorphic-fetch";

const config = {
  videoBase: "http://www.tv4play.se/program/nyhetsmorgon?video_id=",
  url: "http://www.tv4play.se/api/video_assets?nodes=Nyhetsmorgon%20live&nodes_mode=any&node_nids=nyhetsmorgon&node_nids_mode=any&sort_order=desc&type=video&is_live=true&per_page=12&page=1"
}

async function getStreamUrl() {
  try {
    const response = await fetch(config.url);
    const json = await response.json();

    const { id } = json.results[0];

    return config.videoBase + id;
  } catch (error) {
    throw new Error(`Unable to fetch stream url: ${error}`);
  }
}

function openStream(url: string): void {
  child.exec(`livestreamer -np "omxplayer -o hdmi" ${url} best`, stdHandler);
}

function stdHandler(error: Error, stdout: string, stderr: string) {
  console.log(error ? stderr : stdout);
}

getStreamUrl().then(openStream);
