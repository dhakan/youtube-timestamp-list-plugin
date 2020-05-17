(function () {
  console.log("heeysss");

  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  const regex = /.*?(\d{1,2}:\d{1,2}(?::\d{1,2})?).*/g;
  const player = window.wrappedJSObject.movie_player;
  const $description = document.querySelector("#description");
  let storedTimestamps = new Map();
  let currentTimestamp;

  // TODO monitor where in the video we are
  // window.setInterval(() => {
  //   // console.log(player.getCurrentTime());
  //   // console.log(storedTimestamps);
  //   console.log(currentTimestamp);
  // }, 1000);

  class Timestamp {
    constructor(ts, serializedDate, paragraph) {
      this._ts = ts;
      this._serializedDate = serializedDate;
      this._paragraph = paragraph;
    }

    get ts() {
      return this._ts;
    }

    get date() {
      return moment(this._serializedDate);
    }

    get paragraph() {
      return this._paragraph;
    }
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "get-timestamps") {
      if (!storedTimestamps.size) {
        const rows = Array.from($description.innerText.matchAll(regex));
        rows.forEach((row) => {
          const [paragraph, ts] = row;
          const containsHours = ts.split(":").length > 2;
          const date = moment(`2020-04-20 ${containsHours ? ts : `00:${ts}`}`);
          storedTimestamps.set(
            ts,
            new Timestamp(ts, date.valueOf(), paragraph)
          );
        });
      }

      browser.runtime
        .sendMessage({
          command: "timestamps",
          timestamps: storedTimestamps,
        })
        .then(
          () => {},
          (err) => {
            console.log(err);
          }
        );
    } else if (message.command === "seek-to") {
      const timestamp = storedTimestamps.get(message.target);
      console.log(timestamp.date);
      // const containsHours = message.target.split(":").length > 2;
      // const date = moment(
      //   `2020-04-20 ${containsHours ? message.target : `00:${message.target}`}`
      // );
      // const target =
      //   date.hours() * 60 * 60 + date.minutes() * 60 + date.seconds();
      // player.seekTo(target);
      // player.playVideo();
      currentTimestamp = message.target;
    }
  });
})();
