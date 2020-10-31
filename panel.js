const $container = document.querySelector(".container");
const $list = document.querySelector(".list");

const handleActiveTab = (tabs) => {
  const activeTab = tabs[0];

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
    const $li = document.createElement("li");
    $li.classList.add("item");
    $li.innerText = timestamp[0];
    $list.append($li);

    $li.addEventListener("click", () => onTimestampClicked(timestamp));
  };

  const createInfoMessage = (message) => {
    const $div = document.createElement("div");
    $div.classList.add("info-message");
    $div.innerText = message;
    $container.appendChild($div);
  };

  const onMessage = (message) => {
    if (message.command === "timestamps") {
      const { timestamps } = message;

      timestamps.forEach((item) => createTimestampList(item));
    } else if (message.command === "no-timestamps-found") {
      createInfoMessage("No timestamps found for this page");
    }
  };

  browser.runtime.onMessage.addListener(onMessage);
  browser.tabs.sendMessage(activeTab.id, {
    command: "get-timestamps",
  });
};

browser.tabs.query({ active: true, currentWindow: true }).then(handleActiveTab);
// browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
//   console.log('tabs', tabs)
// });
// .catch(reportError);
