const $container = document.querySelector(".container");
const $list = document.querySelector(".list");

const isOnRelevantPage = (href) => href.includes("youtube.com/watch");

const createInfoMessage = (message) => {
  const $div = document.createElement("div");
  $div.classList.add("info-message");
  $div.innerText = message;
  $container.appendChild($div);
};

const handleActiveTab = (tabs) => {
  const onTimestampClicked = (item) => {
    const target = item[1];

    browser.tabs.sendMessage(activeTab.id, {
      command: "seek-to",
      target: target,
    });
  };

  const createTimestampList = (timestamp) => {
    const $list = document.createElement("list");
    $list.classList.add("list");
    $container.appendChild($list);

    const $li = document.createElement("li");
    $li.classList.add("item");
    $li.innerText = timestamp[0];
    $list.append($li);

    $li.addEventListener("click", () => onTimestampClicked(timestamp));
  };

  const onMessage = (message) => {
    const { command } = message;

    if (command === "timestamps") {
      const { timestamps } = message;

      timestamps.forEach((item) => createTimestampList(item));
    } else if (command === "no-timestamps-found") {
      createInfoMessage("No timestamps found for this page");
    } else if (command === "location-href") {
      const { href } = message;

      if (isOnRelevantPage(href)) {
        browser.tabs.sendMessage(activeTab.id, {
          command: "get-timestamps",
        });
      } else {
        createInfoMessage(
          "Timestamps not relevant for this page. Navigate to a youtube video watch page and try again."
        );
      }
    }
  };

  const activeTab = tabs[0];

  browser.runtime.onMessage.addListener(onMessage);

  browser.tabs.sendMessage(activeTab.id, {
    command: "get-location-href",
  });
};

browser.tabs.query({ active: true, currentWindow: true }).then(handleActiveTab);
// .catch((err) => console.error("An error occurred", err));
