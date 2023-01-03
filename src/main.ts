import axios, { AxiosResponse } from "axios";
import { Buffer } from "buffer";
export class Spotify {
  time = <HTMLDivElement>document.querySelector('.time')

  constructor() {
    this.startTime()
    this.retrieveToken()
  }

  async getNewToken(): Promise<AxiosResponse<Response>> {
    // application/x-www-form-urlencoded parameters
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", import.meta.env.VITE_REFRESH_TOKEN
    );
    const encodedSecret = Buffer.from(
      import.meta.env.VITE_CLIENT_ID + ":" + import.meta.env.VITE_CLIENT_SECRET
    ).toString("base64");

    const headers = {
      Authorization: `Basic ${encodedSecret}`,
    };


    // // fetch token with POST request
    const res: AxiosResponse<Response> = await axios.post(
      "https://accounts.spotify.com/api/token", `${params.toString()}`,
      { headers }
    );


    return res;
  }

  async retrieveToken() {
    const token = await this.getNewToken();
    console.log(token.data);

  }

  formatClock() {
    let date = new Date();
    let session = "AM"
    type numOrString = number | string;

    let hours: numOrString = date.getHours();
    if (hours < 10) hours = '0' + hours;

    let mins: numOrString = date.getMinutes();
    if (mins < 10) mins = '0' + mins;

    let secs: numOrString = date.getSeconds();
    if (secs < 10) secs = '0' + secs;

    if (hours === 0) {
      hours = 12
    }

    if (hours > 12) {
      hours = Number(hours) - 12
      session = "PM"
    }

    this.time.innerHTML = `
                           <div>
                             <span>${hours}</span>:<span>${mins}</span>
                           </div>
                           <span>${session}</span>
                          `
  }

  startTime(): void {
    setInterval(() => this.formatClock(), 1000);
  };
}

new Spotify();
