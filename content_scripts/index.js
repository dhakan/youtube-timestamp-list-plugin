(function () {
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

  //   window.setInterval(() => {
  //     console.log(player.getCurrentTime());
  //   }, 1000);

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "get-timestamps") {
      const foundLinks = Array.from($description.innerText.matchAll(regex));
      browser.runtime.sendMessage({
        command: "timestamps",
        timestamps: foundLinks,
      });
    } else if (message.command === "seek-to") {
      const date = moment(`2020-04-20 ${message.target}`);
      const target =
        date.hours() * 60 * 60 + date.minutes() * 60 + date.seconds();
      player.seekTo(target);
      player.playVideo();
    }
  });
})();
