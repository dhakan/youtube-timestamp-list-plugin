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

  const findTimestamps = () => {
    const regex = /.*?(\d{1,2}:\d{1,2}(?::\d{1,2})?).*/g;
    const $description = document.querySelector("#description");
    const timestamps = Array.from($description.innerText.matchAll(regex));

    if (!timestamps.length) {
      browser.runtime.sendMessage({
        command: "no-timestamps-found",
      });
      return;
    }

    browser.runtime.sendMessage({
      command: "timestamps",
      timestamps,
    });
  };

  const seekToTimestamp = (target) => {
    const player = window.wrappedJSObject.movie_player;
    const date = moment(`2020-04-20 ${target}`);
    const convertedTarget =
      date.hours() * 60 * 60 + date.minutes() * 60 + date.seconds();
    player.seekTo(convertedTarget);
    player.playVideo();
  };

  const onMessage = (message) => {
    const { command } = message;

    if (command === "get-timestamps") {
      findTimestamps();
    } else if (command === "seek-to") {
      const { target } = message;
      seekToTimestamp(target);
    } else if (command === "get-location-href") {
      browser.runtime.sendMessage({
        command: "location-href",
        href: location.href,
      });
    }
  };

  browser.runtime.onMessage.addListener(onMessage);
})();
